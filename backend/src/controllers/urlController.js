const Url = require('../models/Url');
const Visit = require('../models/Visit');

// Helper to validate URL format
const isValidUrl = (urlStr) => {
  try {
    const url = new URL(urlStr);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

// Helper to generate a unique short code
const generateShortCode = async () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code;
  let codeExists = true;

  while (codeExists) {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Check database to ensure uniqueness
    const existing = await Url.findOne({ shortCode: code });
    if (!existing) {
      codeExists = false;
    }
  }
  return code;
};

// @desc    Create a shortened URL
// @route   POST /api/urls
// @access  Private
const createUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias, expiryDate } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ message: 'Original URL is required' });
    }

    if (!isValidUrl(originalUrl)) {
      return res.status(400).json({ message: 'Invalid URL format. Must start with http:// or https://' });
    }

    let code;
    let aliasUsed = null;

    if (customAlias && customAlias.trim() !== '') {
      const sanitizedAlias = customAlias.trim().replace(/\s+/g, '-');
      // Validate alias format (alphanumeric, hyphens, underscores)
      if (!/^[a-zA-Z0-9-_]+$/.test(sanitizedAlias)) {
        return res.status(400).json({ message: 'Custom alias can only contain letters, numbers, hyphens, and underscores' });
      }

      // Check if alias exists as shortCode or customAlias
      const aliasExists = await Url.findOne({
        $or: [{ shortCode: sanitizedAlias }, { customAlias: sanitizedAlias }],
      });
      if (aliasExists) {
        return res.status(400).json({ message: 'Custom alias is already taken' });
      }
      code = sanitizedAlias;
      aliasUsed = sanitizedAlias;
    } else {
      code = await generateShortCode();
    }

    const createData = {
      userId: req.user._id,
      originalUrl,
      shortCode: code,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
    };
    if (aliasUsed) {
      createData.customAlias = aliasUsed;
    }

    const newUrl = await Url.create(createData);

    return res.status(201).json(newUrl);
  } catch (error) {
    console.error('Create URL error:', error);
    return res.status(500).json({ message: 'Server error creating shortened URL' });
  }
};

// @desc    Get all URLs for logged in user with search, sort, and pagination
// @route   GET /api/urls
// @access  Private
const getUrls = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sortBy = 'createdAt', order = 'desc' } = req.query;

    const query = { userId: req.user._id };

    // Search query matches originalUrl, shortCode, or customAlias
    if (search) {
      query.$or = [
        { originalUrl: { $regex: search, $options: 'i' } },
        { shortCode: { $regex: search, $options: 'i' } },
        { customAlias: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);

    const totalUrls = await Url.countDocuments(query);
    const urls = await Url.find(query)
      .sort(sortObj)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit);

    // Check if URLs are expired and mark active status on the fly
    const processedUrls = urls.map(url => {
      const isExpired = url.expiryDate && new Date(url.expiryDate) < new Date();
      return {
        ...url.toObject(),
        isActive: !isExpired
      };
    });

    return res.json({
      urls: processedUrls,
      pagination: {
        totalItems: totalUrls,
        totalPages: Math.ceil(totalUrls / parsedLimit),
        currentPage: parsedPage,
        limit: parsedLimit,
      },
    });
  } catch (error) {
    console.error('Get URLs error:', error);
    return res.status(500).json({ message: 'Server error retrieving URLs' });
  }
};

// @desc    Edit destination URL and expiry date
// @route   PUT /api/urls/:id
// @access  Private
const updateUrl = async (req, res) => {
  try {
    const { originalUrl, expiryDate, isPublicStats } = req.body;
    const urlId = req.params.id;

    const url = await Url.findOne({ _id: urlId, userId: req.user._id });
    if (!url) {
      return res.status(404).json({ message: 'URL not found or unauthorized' });
    }

    if (originalUrl) {
      if (!isValidUrl(originalUrl)) {
        return res.status(400).json({ message: 'Invalid URL format. Must start with http:// or https://' });
      }
      url.originalUrl = originalUrl;
    }

    if (expiryDate !== undefined) {
      url.expiryDate = expiryDate ? new Date(expiryDate) : null;
    }

    if (isPublicStats !== undefined) {
      url.isPublicStats = !!isPublicStats;
    }

    await url.save();
    return res.json(url);
  } catch (error) {
    console.error('Update URL error:', error);
    return res.status(500).json({ message: 'Server error updating URL' });
  }
};

// @desc    Delete a URL
// @route   DELETE /api/urls/:id
// @access  Private
const deleteUrl = async (req, res) => {
  try {
    const urlId = req.params.id;

    const url = await Url.findOneAndDelete({ _id: urlId, userId: req.user._id });
    if (!url) {
      return res.status(404).json({ message: 'URL not found or unauthorized' });
    }

    // Clean up all visits associated with this URL
    await Visit.deleteMany({ urlId });

    return res.json({ message: 'URL and analytics data deleted successfully' });
  } catch (error) {
    console.error('Delete URL error:', error);
    return res.status(500).json({ message: 'Server error deleting URL' });
  }
};

// @desc    Bulk URL Shortening from CSV
// @route   POST /api/urls/bulk
// @access  Private
const bulkShorten = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a CSV file' });
    }

    const csvData = req.file.buffer.toString('utf8');
    const lines = csvData.split(/\r?\n/).filter(line => line.trim() !== '');

    if (lines.length < 2) {
      return res.status(400).json({ message: 'CSV file is empty or missing data rows' });
    }

    // Parse headers
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const originalUrlIdx = headers.indexOf('originalurl');
    const customAliasIdx = headers.indexOf('customalias');
    const expiryDateIdx = headers.indexOf('expirydate');

    if (originalUrlIdx === -1) {
      return res.status(400).json({ message: 'CSV must contain an "originalUrl" header column' });
    }

    const results = [];
    const errors = [];

    for (let i = 1; i < lines.length; i++) {
      // Handle commas in quotes if necessary, but keep parser simple first
      const row = lines[i].split(',').map(col => col.trim());
      const originalUrl = row[originalUrlIdx];

      if (!originalUrl) {
        errors.push({ line: i + 1, message: 'Missing original URL' });
        continue;
      }

      if (!isValidUrl(originalUrl)) {
        errors.push({ line: i + 1, originalUrl, message: 'Invalid URL format' });
        continue;
      }

      const customAlias = customAliasIdx !== -1 ? row[customAliasIdx] : undefined;
      const expiryDate = expiryDateIdx !== -1 && row[expiryDateIdx] ? row[expiryDateIdx] : undefined;

      let code;
      let aliasUsed = null;

      try {
        if (customAlias && customAlias.trim() !== '') {
          const sanitizedAlias = customAlias.trim().replace(/\s+/g, '-');
          if (!/^[a-zA-Z0-9-_]+$/.test(sanitizedAlias)) {
            errors.push({ line: i + 1, originalUrl, message: 'Custom alias contains invalid characters' });
            continue;
          }

          const aliasExists = await Url.findOne({
            $or: [{ shortCode: sanitizedAlias }, { customAlias: sanitizedAlias }],
          });
          if (aliasExists) {
            errors.push({ line: i + 1, originalUrl, message: `Alias "${sanitizedAlias}" is already taken` });
            continue;
          }
          code = sanitizedAlias;
          aliasUsed = sanitizedAlias;
        } else {
          code = await generateShortCode();
        }

        const bulkData = {
          userId: req.user._id,
          originalUrl,
          shortCode: code,
          expiryDate: expiryDate ? new Date(expiryDate) : null,
        };
        if (aliasUsed) {
          bulkData.customAlias = aliasUsed;
        }

        const newUrl = await Url.create(bulkData);

        results.push(newUrl);
      } catch (err) {
        errors.push({ line: i + 1, originalUrl, message: err.message });
      }
    }

    return res.status(201).json({
      successCount: results.length,
      errorCount: errors.length,
      createdUrls: results,
      errors,
    });
  } catch (error) {
    console.error('Bulk shorten error:', error);
    return res.status(500).json({ message: 'Server error processing CSV file' });
  }
};

module.exports = {
  createUrl,
  getUrls,
  updateUrl,
  deleteUrl,
  bulkShorten,
};
