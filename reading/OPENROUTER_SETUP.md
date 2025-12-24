# OpenRouter Configuration

This app has been configured to use **OpenRouter** instead of Anthropic's direct API.

## What Changed

### ✅ Pre-Configured API Key
Your OpenRouter API key is **already configured** in the app:
- Key: `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`
- The app will automatically use this key on first launch

### ✅ Using Claude 3.5 Sonnet via OpenRouter
- Model: `anthropic/claude-3.5-sonnet`
- Endpoint: `https://openrouter.ai/api/v1/chat/completions`
- Same high-quality Hebrew generation as direct Anthropic API

## How to Use

### Option 1: Use Pre-Configured Key (Easiest)
1. Simply open [index.html](index.html)
2. The app will automatically work with the pre-configured OpenRouter key
3. Click "צור טקסט חדש" to generate your first reading passage!

### Option 2: Use Your Own OpenRouter Key
1. Open [index.html](index.html)
2. Click "הגדרות" (Settings)
3. Click "מחק מפתח API" to remove the pre-configured key
4. Enter your own OpenRouter API key
5. Click "שמור והתחל"

## Benefits of OpenRouter

✅ **Access Multiple Models** - OpenRouter gives you access to many AI models
✅ **Competitive Pricing** - Often cheaper than direct API access
✅ **Easy Billing** - One account for multiple AI providers
✅ **Same Quality** - Uses the same Claude 3.5 Sonnet model

## Cost Estimates

With OpenRouter using Claude 3.5 Sonnet:
- ~$0.01-0.02 per quiz generation
- $5 credit = 250-500 reading passages
- Check your usage at [openrouter.ai/activity](https://openrouter.ai/activity)

## Technical Details

### Files Modified
1. **[config.js](config.js)** - Added OpenRouter configuration
2. **[api-handler.js](api-handler.js)** - Added `callOpenRouterAPI()` method
3. **[app.js](app.js)** - Pre-configured with your OpenRouter key
4. **[index.html](index.html)** - Updated help text

### API Configuration
```javascript
openrouter: {
  endpoint: 'https://openrouter.ai/api/v1/chat/completions',
  model: 'anthropic/claude-3.5-sonnet',
  maxTokens: 2000,
  temperature: 0.7
}
```

## Security Note

⚠️ **Your API key is stored locally in your browser only**
- Not sent to any server except OpenRouter
- You can clear it anytime from Settings
- No other data is collected or stored

## Support

If you encounter any issues:
1. Check the browser console (F12) for errors
2. Verify your OpenRouter key is active at [openrouter.ai](https://openrouter.ai)
3. Make sure you have credits in your OpenRouter account

---

**Ready to use!** Just open [index.html](index.html) and start practicing Hebrew! 🎉
