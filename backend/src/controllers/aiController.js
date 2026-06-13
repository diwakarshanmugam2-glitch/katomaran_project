const Url = require('../models/Url');
const Visit = require('../models/Visit');

// Simple Smart Mock AI Engine
exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const lowerMsg = message.toLowerCase();
    let reply = "I'm your SnapLink AI assistant. I can help you analyze your links or answer general questions about the platform. What would you like to know?";

    // Keywords logic
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi ') || lowerMsg === 'hi') {
      reply = "Hello there! How can I help you optimize your links today?";
    } else if (lowerMsg.includes('how many links') || lowerMsg.includes('total links')) {
      const linkCount = await Url.countDocuments({ user: userId });
      reply = `You currently have ${linkCount} active links in your account.`;
    } else if (lowerMsg.includes('clicks') || lowerMsg.includes('traffic') || lowerMsg.includes('stats')) {
      const urls = await Url.find({ user: userId });
      const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
      reply = `Across all your links, you have accumulated ${totalClicks} total clicks. Your audience is growing!`;
    } else if (lowerMsg.includes('browser') || lowerMsg.includes('device') || lowerMsg.includes('country') || lowerMsg.includes('location')) {
      const urls = await Url.find({ user: userId }).select('_id');
      const urlIds = urls.map(u => u._id);
      const visits = await Visit.find({ url: { $in: urlIds } });
      
      let browsers = {};
      let devices = {};
      let countries = {};
      
      visits.forEach(v => {
        browsers[v.browser] = (browsers[v.browser] || 0) + 1;
        devices[v.device] = (devices[v.device] || 0) + 1;
        countries[v.country || 'Unknown'] = (countries[v.country || 'Unknown'] || 0) + 1;
      });
      
      const topBrowser = Object.keys(browsers).sort((a,b) => browsers[b] - browsers[a])[0] || 'Unknown';
      const topDevice = Object.keys(devices).sort((a,b) => devices[b] - devices[a])[0] || 'Unknown';
      
      reply = `Based on your recent analytics: your top browser is ${topBrowser}, and your top device is ${topDevice}. Checking these metrics regularly helps you optimize your landing pages for the right platforms!`;
    } else if (lowerMsg.includes('help')) {
      reply = "You can ask me things like 'How many links do I have?', 'What are my total clicks?', or 'What is my top browser?'. I am constantly learning new ways to assist you.";
    } else if (lowerMsg.includes('optimize') || lowerMsg.includes('tips')) {
      reply = "To optimize your links, try using custom aliases that match your brand, and share your links on platforms where your audience is most active. Tracking your analytics regularly is key!";
    } else if (lowerMsg.includes('who are you') || lowerMsg.includes('what are you')) {
      reply = "I am SnapLink AI, a virtual assistant designed to help you analyze your traffic, manage links, and get the most out of this platform.";
    } else {
      // Default fallback that sounds intelligent
      reply = `That's interesting! While I can't fully process "${message}" just yet, I recommend checking your dashboard analytics for deeper insights into your link performance.`;
    }

    // Small simulated delay for realism in the backend (optional, but good for testing)
    setTimeout(() => {
      res.status(200).json({
        reply
      });
    }, 800);

  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ message: 'Error processing AI request' });
  }
};
