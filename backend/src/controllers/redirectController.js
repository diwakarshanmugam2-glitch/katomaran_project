const Url = require('../models/Url');
const Visit = require('../models/Visit');
const useragent = require('useragent');

// Helper to get device type from user agent
const getDeviceType = (uaString) => {
  if (!uaString) return 'Desktop';
  const ua = uaString.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/i.test(ua)) {
    return 'Mobile';
  }
  return 'Desktop';
};

// Helper to get browser name from user agent
const getBrowserName = (uaString) => {
  if (!uaString) return 'Unknown';
  const ua = uaString.toLowerCase();
  if (ua.includes('firefox')) return 'Firefox';
  if (ua.includes('chrome') && !ua.includes('edge') && !ua.includes('opr')) return 'Chrome';
  if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari';
  if (ua.includes('edge') || ua.includes('edg')) return 'Edge';
  if (ua.includes('opera') || ua.includes('opr')) return 'Opera';
  
  // Fallback to useragent package
  const agent = useragent.parse(uaString);
  return agent.family || 'Unknown';
};

// Hardcoded location for local testing to match the user's current location
const getRandomLocation = () => {
  return { country: 'India', city: 'Coimbatore' };
};

// @desc    Redirect short code to original URL and log analytics
// @route   GET /:shortCode
// @access  Public
const handleRedirect = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Find URL by shortCode or customAlias
    const url = await Url.findOne({
      $or: [{ shortCode }, { customAlias: shortCode }],
    });

    if (!url) {
      // If not found, redirect to frontend homepage or 404 page
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(`${frontendUrl}/not-found?code=${shortCode}`);
    }

    // Check expiration date
    if (url.expiryDate && new Date(url.expiryDate) < new Date()) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(`${frontendUrl}/expired`);
    }

    // Capture visitor details
    const uaString = req.headers['user-agent'];
    const browser = getBrowserName(uaString);
    const device = getDeviceType(uaString);
    
    // Simulate high-quality locations for loopback/local IPs during testing
    const location = getRandomLocation();
    const { country, city } = location;

    // Update URL document
    url.totalClicks += 1;
    url.lastVisited = new Date();
    await url.save();

    // Log visit analytics
    await Visit.create({
      urlId: url._id,
      browser,
      device,
      country,
      city,
    });

    // Server-side redirect
    return res.redirect(302, url.originalUrl);
  } catch (error) {
    console.error('Redirect error:', error);
    return res.status(500).json({ message: 'Server error processing redirection' });
  }
};

module.exports = {
  handleRedirect,
};
