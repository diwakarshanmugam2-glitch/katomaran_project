const Url = require('../models/Url');
const Visit = require('../models/Visit');

// @desc    Get analytics for a specific URL
// @route   GET /api/analytics/:id
// @access  Public/Private (Checked via public toggle or user authorization)
const getUrlAnalytics = async (req, res) => {
  try {
    const urlId = req.params.id;

    // Fetch the URL first
    const url = await Url.findById(urlId);
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    // Check if user is owner of the URL. If not owner, check if the url public stats are enabled.
    const isOwner = req.user && url.userId.toString() === req.user._id.toString();
    if (!isOwner && !url.isPublicStats) {
      return res.status(403).json({ message: 'Unauthorized access to analytics data' });
    }

    // Total clicks
    const totalClicks = await Visit.countDocuments({ urlId });

    // Last visited
    const lastVisit = await Visit.findOne({ urlId }).sort({ timestamp: -1 });
    const lastVisited = lastVisit ? lastVisit.timestamp : null;

    // Recent visits (last 30)
    const recentVisits = await Visit.find({ urlId })
      .sort({ timestamp: -1 })
      .limit(30);

    // Browser distribution
    const browsers = await Visit.aggregate([
      { $match: { urlId: url._id } },
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Device distribution
    const devices = await Visit.aggregate([
      { $match: { urlId: url._id } },
      { $group: { _id: '$device', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Geolocation distribution - Countries
    const countries = await Visit.aggregate([
      { $match: { urlId: url._id } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Geolocation distribution - Cities
    const cities = await Visit.aggregate([
      { $match: { urlId: url._id } },
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Daily Click Trends (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const trendsRaw = await Visit.aggregate([
      {
        $match: {
          urlId: url._id,
          timestamp: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          clicks: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format daily trends to guarantee all of the last 7 days are represented, even if 0 clicks
    const trends = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const match = trendsRaw.find(t => t._id === dateStr);
      trends.push({
        date: dateStr,
        clicks: match ? match.clicks : 0
      });
    }

    return res.json({
      url: {
        _id: url._id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        customAlias: url.customAlias,
        createdAt: url.createdAt,
        expiryDate: url.expiryDate,
        isPublicStats: url.isPublicStats,
      },
      stats: {
        totalClicks,
        lastVisited,
      },
      recentVisits: recentVisits.map(v => ({
        _id: v._id,
        timestamp: v.timestamp,
        browser: v.browser,
        device: v.device,
        country: v.country,
        city: v.city,
      })),
      distributions: {
        browsers: browsers.map(b => ({ name: b._id || 'Unknown', value: b.count })),
        devices: devices.map(d => ({ name: d._id || 'Unknown', value: d.count })),
        countries: countries.map(c => ({ name: c._id || 'Unknown', value: c.count })),
        cities: cities.map(c => ({ name: c._id || 'Unknown', value: c.count })),
      },
      trends,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return res.status(500).json({ message: 'Server error retrieving analytics' });
  }
};

module.exports = {
  getUrlAnalytics,
};
