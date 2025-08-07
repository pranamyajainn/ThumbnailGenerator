import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Palette, Type, Move, RotateCcw, Lightbulb, Camera, AlertTriangle, Shield, BarChart3, Vote, FileText } from 'lucide-react';

const SmartThumbnailCreator = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [heading, setHeading] = useState('');
  const [showHeadingInput, setShowHeadingInput] = useState(false);
  const [generatedThumbnail, setGeneratedThumbnail] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  
  // Political content categories
  const [contentCategory, setContentCategory] = useState('breaking-news');
  
  // Enhanced customization options for political content
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [backgroundColor, setBackgroundColor] = useState('#CC0000');
  const [accentColor, setAccentColor] = useState('#FFD700');
  const [fontSize, setFontSize] = useState(48);
  const [textPosition, setTextPosition] = useState({ x: 50, y: 20 });
  const [fontFamily, setFontFamily] = useState('Times New Roman');
  const [textStyle, setTextStyle] = useState('outlined');
  const [shadowIntensity, setShadowIntensity] = useState(4);
  const [showBadge, setShowBadge] = useState(true);
  const [badgeText, setBadgeText] = useState('BREAKING');
  const [textWrapping, setTextWrapping] = useState(true);
  
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Political content presets
  const politicalPresets = {
    'breaking-news': {
      name: 'Breaking News',
      icon: AlertTriangle,
      textColor: '#FFFFFF',
      backgroundColor: '#CC0000',
      accentColor: '#FFD700',
      fontFamily: 'Times New Roman',
      badgeText: 'BREAKING',
      description: 'Urgent red alert styling for breaking political news'
    },
    'government-updates': {
      name: 'Government Updates',
      icon: Shield,
      textColor: '#FFFFFF',
      backgroundColor: '#1B365D',
      accentColor: '#FFD700',
      fontFamily: 'Georgia',
      badgeText: 'OFFICIAL',
      description: 'Presidential blue with gold accents for official updates'
    },
    'political-analysis': {
      name: 'Political Analysis',
      icon: BarChart3,
      textColor: '#2D3748',
      backgroundColor: '#E2E8F0',
      accentColor: '#4A5568',
      fontFamily: 'Crimson Text',
      badgeText: 'ANALYSIS',
      description: 'Neutral analytical design for political commentary'
    },
    'election-coverage': {
      name: 'Election Coverage',
      icon: Vote,
      textColor: '#FFFFFF',
      backgroundColor: '#1E40AF',
      accentColor: '#DC2626',
      fontFamily: 'Times New Roman',
      badgeText: 'ELECTION',
      description: 'Patriotic red, white, and blue for election content'
    },
    'policy-updates': {
      name: 'Policy Updates',
      icon: FileText,
      textColor: '#F7FAFC',
      backgroundColor: '#2A4365',
      accentColor: '#FFD700',
      fontFamily: 'Georgia',
      badgeText: 'POLICY',
      description: 'Professional navy and gold for policy announcements'
    }
  };

  // Auto font-size calculation based on headline length
  const calculateOptimalFontSize = (text) => {
    const baseSize = 48;
    const length = text.length;
    
    if (length <= 20) return Math.min(baseSize + 8, 64);
    if (length <= 40) return baseSize;
    if (length <= 60) return Math.max(baseSize - 8, 32);
    if (length <= 80) return Math.max(baseSize - 16, 28);
    return Math.max(baseSize - 24, 24);
  };

  // Apply preset styling
  const applyPreset = (presetKey) => {
    const preset = politicalPresets[presetKey];
    setContentCategory(presetKey);
    setTextColor(preset.textColor);
    setBackgroundColor(preset.backgroundColor);
    setAccentColor(preset.accentColor);
    setFontFamily(preset.fontFamily);
    setBadgeText(preset.badgeText);
    setFontSize(calculateOptimalFontSize(heading));
  };

  useEffect(() => {
    if (heading) {
      setFontSize(calculateOptimalFontSize(heading));
    }
  }, [heading]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setShowHeadingInput(true);
        setGeneratedThumbnail(null);
        setShowSuggestions(false);
        setShowCustomization(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(' ');
    let line = '';
    const lines = [];
    
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);
    
    return lines;
  };

  const generateThumbnail = () => {
    if (!uploadedImage || !heading) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set YouTube thumbnail dimensions (16:9 aspect ratio)
    canvas.width = 1280;
    canvas.height = 720;

    const img = new Image();
    img.onload = () => {
      // Draw background image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Add sophisticated overlay based on category
      let overlayGradient;
      if (contentCategory === 'breaking-news') {
        overlayGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        overlayGradient.addColorStop(0, 'rgba(204,0,0,0.4)');
        overlayGradient.addColorStop(1, 'rgba(0,0,0,0.6)');
      } else if (contentCategory === 'government-updates') {
        overlayGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        overlayGradient.addColorStop(0, 'rgba(27,54,93,0.3)');
        overlayGradient.addColorStop(1, 'rgba(0,0,0,0.5)');
      } else {
        overlayGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        overlayGradient.addColorStop(0, 'rgba(0,0,0,0.2)');
        overlayGradient.addColorStop(1, 'rgba(0,0,0,0.4)');
      }
      
      ctx.fillStyle = overlayGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw badge if enabled
      if (showBadge && badgeText) {
        drawBadge(ctx);
      }
      
      // Draw main text
      drawPoliticalText(ctx);
      
      const thumbnailDataUrl = canvas.toDataURL('image/png');
      setGeneratedThumbnail(thumbnailDataUrl);
      setShowSuggestions(true);
    };
    img.src = uploadedImage;
  };

  const drawBadge = (ctx) => {
    const canvas = canvasRef.current;
    const badgeHeight = 60;
    const badgeWidth = 200;
    const x = canvas.width - badgeWidth - 30;
    const y = 30;
    
    // Badge background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(x, y, badgeWidth, badgeHeight);
    
    // Badge accent border
    ctx.fillStyle = accentColor;
    ctx.fillRect(x, y, badgeWidth, 8);
    ctx.fillRect(x, y + badgeHeight - 8, badgeWidth, 8);
    
    // Badge text
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.fillText(badgeText, x + badgeWidth / 2, y + badgeHeight / 2 + 8);
  };

  const drawPoliticalText = (ctx) => {
    const canvas = canvasRef.current;
    
    // Calculate responsive font size
    const responsiveFontSize = Math.max(fontSize * (canvas.width / 1280), 24);
    
    // Set sophisticated font for political content
    const fontWeight = contentCategory === 'breaking-news' ? 'bold' : '600';
    ctx.font = `${fontWeight} ${responsiveFontSize}px ${fontFamily}, serif`;
    ctx.textAlign = 'center';
    
    // Calculate text position
    const x = (textPosition.x / 100) * canvas.width;
    let y = (textPosition.y / 100) * canvas.height + responsiveFontSize;
    
    // Handle text wrapping for long headlines
    if (textWrapping && heading.length > 40) {
      const maxWidth = canvas.width * 0.8;
      const lineHeight = responsiveFontSize * 1.2;
      const lines = wrapText(ctx, heading, x, y, maxWidth, lineHeight);
      
      // Adjust starting position for multiple lines
      const totalHeight = lines.length * lineHeight;
      y = y - (totalHeight / 2) + lineHeight;
      
      lines.forEach((line, index) => {
        const lineY = y + (index * lineHeight);
        
        // Draw text background for analysis category
        if (textStyle === 'background') {
          const textMetrics = ctx.measureText(line);
          const padding = 20;
          ctx.fillStyle = backgroundColor + 'DD';
          ctx.fillRect(
            x - textMetrics.width / 2 - padding,
            lineY - responsiveFontSize - padding / 2,
            textMetrics.width + padding * 2,
            responsiveFontSize + padding
          );
        }
        
        // Enhanced shadow for political content
        if (textStyle === 'outlined') {
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = shadowIntensity;
          ctx.strokeText(line.trim(), x, lineY);
          
          // Additional accent outline for breaking news
          if (contentCategory === 'breaking-news') {
            ctx.strokeStyle = accentColor;
            ctx.lineWidth = 2;
            ctx.strokeText(line.trim(), x, lineY);
          }
        }
        
        // Main text with political styling
        ctx.fillStyle = textColor;
        ctx.fillText(line.trim(), x, lineY);
      });
    } else {
      // Single line text
      if (textStyle === 'background') {
        const textMetrics = ctx.measureText(heading);
        const padding = 25;
        ctx.fillStyle = backgroundColor + 'DD';
        ctx.fillRect(
          x - textMetrics.width / 2 - padding,
          y - responsiveFontSize - padding / 2,
          textMetrics.width + padding * 2,
          responsiveFontSize + padding
        );
      }
      
      if (textStyle === 'outlined') {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = shadowIntensity;
        ctx.strokeText(heading, x, y);
        
        if (contentCategory === 'breaking-news') {
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 2;
          ctx.strokeText(heading, x, y);
        }
      }
      
      ctx.fillStyle = textColor;
      ctx.fillText(heading, x, y);
    }
  };

  const updateThumbnail = () => {
    if (!uploadedImage || !heading) return;
    generateThumbnail();
  };

  useEffect(() => {
    if (generatedThumbnail) {
      updateThumbnail();
    }
  }, [textColor, backgroundColor, accentColor, fontSize, textPosition, fontFamily, textStyle, shadowIntensity, showBadge, badgeText, contentCategory, textWrapping]);

  const downloadThumbnail = () => {
    if (!generatedThumbnail) return;
    
    const link = document.createElement('a');
    const categoryName = politicalPresets[contentCategory].name.replace(/\s+/g, '-').toLowerCase();
    link.download = `political-thumbnail-${categoryName}.png`;
    link.href = generatedThumbnail;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const politicalSuggestions = [
    {
      title: "Political Color Psychology",
      tip: "Red conveys urgency and action, blue represents trust and stability, gold adds authority and prestige."
    },
    {
      title: "Typography for Authority",
      tip: "Serif fonts like Times New Roman and Georgia convey credibility and establishment trust in political content."
    },
    {
      title: "Breaking News Urgency",
      tip: "Use red backgrounds, bold fonts, and 'BREAKING' badges to create immediate visual impact for urgent news."
    },
    {
      title: "Government Formality",
      tip: "Presidential blue (#1B365D) with gold accents creates official, authoritative appearance for government content."
    },
    {
      title: "Neutral Analysis Design",
      tip: "For political analysis, use neutral grays and clean typography to maintain objectivity and professionalism."
    },
    {
      title: "Election Coverage Impact",
      tip: "Patriotic red, white, and blue color schemes with ballot-inspired elements boost engagement for election content."
    },
    {
      title: "Headline Length Optimization",
      tip: "Keep political headlines under 60 characters for mobile readability while maintaining impact and clarity."
    },
    {
      title: "Authority Symbols",
      tip: "Incorporate badges, seals, or official styling elements to enhance perceived credibility and authority."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Camera className="text-red-400" />
            Political Thumbnail Creator
          </h1>
          <p className="text-blue-200">Professional thumbnails for political and news content</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Upload & Category Selection */}
          <div className="space-y-6">
            {/* Political Category Selection */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4">Content Category</h2>
              
              <div className="space-y-3">
                {Object.entries(politicalPresets).map(([key, preset]) => {
                  const IconComponent = preset.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => applyPreset(key)}
                      className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                        contentCategory === key
                          ? 'border-blue-400 bg-blue-500/30 text-white'
                          : 'border-white/20 bg-white/5 text-blue-200 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <IconComponent size={20} className="mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold">{preset.name}</h3>
                          <p className="text-sm opacity-80 mt-1">{preset.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Upload Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Upload size={20} />
                Upload Your Image
              </h2>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-4 border-2 border-dashed border-blue-300 rounded-lg text-center hover:border-blue-400 transition-colors bg-blue-500/20 hover:bg-blue-500/30"
              >
                <Upload className="mx-auto mb-2 text-blue-300" size={32} />
                <span className="text-white">Click to upload your image</span>
                <p className="text-blue-200 text-sm mt-1">JPG, PNG up to 10MB</p>
              </button>
              
              {uploadedImage && (
                <div className="mt-4">
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-full h-32 object-cover rounded-lg border-2 border-green-400"
                  />
                  <p className="text-green-300 text-sm mt-2 flex items-center gap-1">
                    ✓ Image uploaded successfully
                  </p>
                </div>
              )}
            </div>

            {/* Heading Input */}
            {showHeadingInput && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Type size={20} />
                  Political Headline
                </h2>
                
                <textarea
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  placeholder="Enter your political headline..."
                  className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  rows={3}
                  maxLength={120}
                />
                
                <div className="flex justify-between items-center mt-2">
                  <span className="text-blue-200 text-sm">{heading.length}/120 characters</span>
                  <span className="text-yellow-300 text-sm">Auto font-size: {calculateOptimalFontSize(heading)}px</span>
                </div>
                
                {heading && (
                  <button
                    onClick={generateThumbnail}
                    className="w-full mt-4 bg-gradient-to-r from-red-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-red-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
                  >
                    Generate Political Thumbnail
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Middle Column - Preview */}
          <div className="space-y-6">
            {/* Thumbnail Preview */}
            {generatedThumbnail && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h2 className="text-xl font-semibold text-white mb-4">Thumbnail Preview</h2>
                
                <div className="relative">
                  <img
                    src={generatedThumbnail}
                    alt="Generated Thumbnail"
                    className="w-full rounded-lg shadow-2xl border-2 border-yellow-400"
                  />
                  <div className="absolute top-2 left-2 bg-blue-800 text-white px-3 py-1 rounded text-xs font-semibold">
                    {politicalPresets[contentCategory].name.toUpperCase()}
                  </div>
                </div>
                
                <button
                  onClick={downloadThumbnail}
                  className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download Political Thumbnail (1280x720)
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Customization & Suggestions */}
          <div className="space-y-6">
            {/* Advanced Customization Panel */}
            {generatedThumbnail && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Palette size={20} />
                    Political Styling
                  </h2>
                  <button
                    onClick={() => setShowCustomization(!showCustomization)}
                    className="text-blue-300 hover:text-blue-200 transition-colors"
                  >
                    {showCustomization ? 'Hide' : 'Show'} Options
                  </button>
                </div>

                {showCustomization && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-white text-sm mb-2">Typography</label>
                        <select
                          value={fontFamily}
                          onChange={(e) => setFontFamily(e.target.value)}
                          className="w-full p-2 rounded bg-white/20 border border-white/30 text-white"
                        >
                          <option value="Times New Roman">Times New Roman (Authority)</option>
                          <option value="Georgia">Georgia (Government)</option>
                          <option value="Crimson Text">Crimson Text (Analysis)</option>
                          <option value="serif">Default Serif</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-white text-sm mb-2">Text Color</label>
                          <input
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="w-full h-10 rounded cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-white text-sm mb-2">Background</label>
                          <input
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="w-full h-10 rounded cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-white text-sm mb-2">Accent</label>
                          <input
                            type="color"
                            value={accentColor}
                            onChange={(e) => setAccentColor(e.target.value)}
                            className="w-full h-10 rounded cursor-pointer"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-white text-sm mb-2">Font Size: {fontSize}px (Auto-calculated)</label>
                        <input
                          type="range"
                          min="20"
                          max="80"
                          value={fontSize}
                          onChange={(e) => setFontSize(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-white text-sm mb-2">Text Style</label>
                        <select
                          value={textStyle}
                          onChange={(e) => setTextStyle(e.target.value)}
                          className="w-full p-2 rounded bg-white/20 border border-white/30 text-white"
                        >
                          <option value="outlined">Outlined Text (Recommended)</option>
                          <option value="background">Background Box</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-white text-sm">Smart Text Wrapping</label>
                        <input
                          type="checkbox"
                          checked={textWrapping}
                          onChange={(e) => setTextWrapping(e.target.checked)}
                          className="rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-white text-sm">Show Category Badge</label>
                        <input
                          type="checkbox"
                          checked={showBadge}
                          onChange={(e) => setShowBadge(e.target.checked)}
                          className="rounded"
                        />
                      </div>

                      {showBadge && (
                        <div>
                          <label className="block text-white text-sm mb-2">Badge Text</label>
                          <input
                            type="text"
                            value={badgeText}
                            onChange={(e) => setBadgeText(e.target.value)}
                            className="w-full p-2 rounded bg-white/20 border border-white/30 text-white"
                            maxLength={12}
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-white text-sm mb-2">Text Position</label>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-blue-200">Horizontal: {textPosition.x}%</label>
                            <input
                              type="range"
                              min="10"
                              max="90"
                              value={textPosition.x}
                              onChange={(e) => setTextPosition({...textPosition, x: parseInt(e.target.value)})}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-blue-200">Vertical: {textPosition.y}%</label>
                            <input
                              type="range"
                              min="10"
                              max="80"
                              value={textPosition.y}
                              onChange={(e) => setTextPosition({...textPosition, y: parseInt(e.target.value)})}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Political Optimization Suggestions */}
            {showSuggestions && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Lightbulb size={20} className="text-yellow-400" />
                  Political Content Tips
                </h2>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {politicalSuggestions.map((suggestion, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <h3 className="font-semibold text-yellow-300 mb-1 text-sm">{suggestion.title}</h3>
                      <p className="text-blue-100 text-xs">{suggestion.tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hidden Canvas */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default SmartThumbnailCreator;
