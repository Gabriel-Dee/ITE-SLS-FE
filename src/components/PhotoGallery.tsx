import React, { useState, useEffect, useRef } from 'react';
import { 
  Image, 
  Upload, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Tag, 
  Calendar, 
  User, 
  Download, 
  Share2, 
  CheckCircle2, 
  Maximize2, 
  Info,
  CalendarDays,
  Sparkles,
  MapPin
} from 'lucide-react';
import { initialGallery, unfTeaserInfo } from '../galleryData';
import { GalleryItem } from '../types';

export default function PhotoGallery() {
  // Gallery State
  const [items, setItems] = useState<GalleryItem[]>(initialGallery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Lightbox State
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  
  // Upload State
  const [uploadTitle, setUploadTitle] = useState<string>('');
  const [uploadCategory, setUploadCategory] = useState<'highlights' | 'competitions' | 'networking'>('highlights');
  const [uploadDescription, setUploadDescription] = useState<string>('');
  const [uploadAuthor, setUploadAuthor] = useState<string>('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);

  // Brand Toggle State (Osprey UNF Takeover mode!)
  const [isUNFTakeover, setIsUNFTakeover] = useState<boolean>(true); // Default to active to honor the prompt's focus

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen || activeItemIndex === null) return;
      if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'Escape') {
        closeLightbox();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, activeItemIndex, items]);

  // Handle Drag Over & Leave
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Process File Selection
  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Only image files are permitted!');
      return;
    }
    setUploadFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setUploadPreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Dropped file
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Handle file select click change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Submitting Mock Upload
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadAuthor.trim() || (!uploadPreview && !uploadFile)) {
      alert('Please fill in a title, your name, and select a photo!');
      return;
    }

    const newItem: GalleryItem = {
      id: `g_user_${Date.now()}`,
      url: uploadPreview || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
      title: uploadTitle,
      category: uploadCategory,
      uploadedBy: uploadAuthor,
      date: 'Today',
      description: uploadDescription || 'User contributed SLS memory.',
      isCustom: true
    };

    setItems([newItem, ...items]);
    setUploadSuccess(true);
    
    // Reset fields
    setUploadTitle('');
    setUploadDescription('');
    setUploadAuthor('');
    setUploadFile(null);
    setUploadPreview(null);

    setTimeout(() => {
      setUploadSuccess(false);
    }, 4000);
  };

  const deleteCustomItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this photo from your session list?')) {
      setItems(items.filter(item => item.id !== id));
      if (lightboxOpen) {
        closeLightbox();
      }
    }
  };

  // Category Filtering
  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (item.uploadedBy && item.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Lightbox functions
  const openLightbox = (id: string) => {
    const idx = items.findIndex(item => item.id === id);
    if (idx !== -1) {
      setActiveItemIndex(idx);
      setLightboxOpen(true);
    }
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setActiveItemIndex(null);
  };

  // Dynamic next/prev image within active filtered list
  const handleNextImage = () => {
    if (activeItemIndex === null) return;
    const nextIdx = (activeItemIndex + 1) % items.length;
    setActiveItemIndex(nextIdx);
  };

  const handlePrevImage = () => {
    if (activeItemIndex === null) return;
    const prevIdx = (activeItemIndex - 1 + items.length) % items.length;
    setActiveItemIndex(prevIdx);
  };

  const activeItem = activeItemIndex !== null ? items[activeItemIndex] : null;

  // Custom Colors declarations
  // University of North Florida Official Palette colors
  const unfNavyStyle = { backgroundColor: '#0A233F' };
  const unfGrayStyle = { backgroundColor: '#A7A8A9' };

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-[#f8fafc] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* UNF Host Feature Accent Baner */}
        <div className="mb-14 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Visual Teaser Column */}
            <div className="relative h-64 lg:col-span-5 lg:h-auto overflow-hidden">
              <img 
                src={unfTeaserInfo.url} 
                alt={unfTeaserInfo.title}
                className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A233F]/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#0A233F]/90" />
              
              <div className="absolute bottom-4 left-4 rounded bg-white/90 px-3 py-1 text-xs font-mono font-bold text-[#0A233F] shadow">
                🎥 Future Host Preview
              </div>
            </div>

            {/* Teaser text / UNF Branding Intro */}
            <div className={`p-6 sm:p-8 lg:col-span-7 text-white flex flex-col justify-between transition-colors duration-500`} style={{ backgroundColor: '#0A233F' }}>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/10 px-3.5 py-1 text-xs font-mono font-black tracking-widest uppercase border border-white/20">
                    ★ NEXT SUMMIT HOST ★
                  </span>
                  <span className="rounded-full bg-[#A7A8A9]/30 px-3.5 py-1 text-xs font-bold font-sans text-slate-100 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    Jacksonville, FL
                  </span>
                </div>
                
                <h3 className="text-3xl font-black tracking-tight text-white leading-none uppercase">
                  ITE SLS 2027 • <span className="text-[#A7A8A9] tracking-wide font-serif italic">UNF Ospreys</span>
                </h3>
                
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                  {unfTeaserInfo.description} From high-performance logistics simulations along the St. Johns River to regional traffic flow modeling, the future is incredibly bright. Follow us into 2027!
                </p>
              </div>

              {/* UNF signature color display bar */}
              <div className="mt-8 border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono tracking-widest text-[#A7A8A9] uppercase font-bold">UNF Colors Flag</span>
                  <div className="flex gap-1.5">
                    <div className="w-6 h-6 rounded-full border border-white/30 shadow-sm" style={{ backgroundColor: '#0A233F' }} title="UNF Navy (#0A233F)" />
                    <div className="w-6 h-6 rounded-full border border-white/30 shadow-sm" style={{ backgroundColor: '#A7A8A9' }} title="UNF Gray (#A7A8A9)" />
                    <div className="w-6 h-6 rounded-full border border-white/30 shadow-sm bg-white" title="White Accent" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsUNFTakeover(!isUNFTakeover)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-350 cursor-pointer ${
                      isUNFTakeover 
                        ? 'bg-white text-[#0A233F] font-black shadow-md border border-white hover:bg-slate-100' 
                        : 'bg-white/10 text-white border border-white/30 hover:bg-white/20'
                    }`}
                  >
                    {isUNFTakeover ? "✓ UNF Colorway Mode Enabled" : "Apply UNF Theme Accents"}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Section title */}
        <div className="text-center mb-12">
          <h2 className="text-xs font-mono font-bold tracking-widest uppercase mb-2" style={{ color: isUNFTakeover ? '#0A233F' : '#059669' }}>
            Summit Memories
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Interactive Photo Gallery
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mt-2">
            Relive key memories of our joint technical events, regional challenges, and professional networking meetings. Browse or add your own photos!
          </p>
          <div className="h-1 w-20 mt-4 mx-auto rounded transition-colors duration-500" style={{ backgroundColor: isUNFTakeover ? '#0A233F' : '#10b981' }} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: GRID & CONTROLS (8 COLS) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* SEARCH & FILTERS BOX */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Category selector */}
              <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                {[
                  { value: 'all', label: 'All Photos' },
                  { value: 'highlights', label: 'Highlights' },
                  { value: 'competitions', label: 'Competitions' },
                  { value: 'networking', label: 'Networking' }
                ].map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === cat.value
                        ? isUNFTakeover 
                          ? 'bg-[#0A233F] text-white shadow-sm'
                          : 'bg-blue-900 text-white shadow-sm'
                        : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search title or uploader..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-sans text-slate-700 outline-none focus:ring-1 focus:ring-slate-300"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-700">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

            </div>

            {/* RESULTS COUNTER */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <p>Showing {filteredItems.length} of {items.length} moments</p>
              {selectedCategory !== 'all' && (
                <button onClick={() => setSelectedCategory('all')} className="text-blue-600 hover:underline">
                  Clear filter
                </button>
              )}
            </div>

            {/* GRID OF PICS */}
            {filteredItems.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 py-16 px-4 text-center">
                <Image className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-650 font-bold mb-1 col-span-full">No gallery images found</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">Try resetting your category filters or adjusting search parameters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredItems.map((photo) => {
                  return (
                    <div 
                      key={photo.id}
                      onClick={() => openLightbox(photo.id)}
                      className="group bg-white rounded-2xl overflow-hidden border border-slate-180 hover:border-slate-300 shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between"
                    >
                      {/* Photo wrapper */}
                      <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                        <img 
                          src={photo.url} 
                          alt={photo.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                        
                        {/* Hover Zoom overlay button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                          <div className={`p-2.5 rounded-full text-white shadow-lg scale-90 group-hover:scale-100 transition-transform ${isUNFTakeover ? 'bg-[#0A233F]/90' : 'bg-[#0d1e57]/90'}`}>
                            <Maximize2 className="w-4 h-4" />
                          </div>
                        </div>

                        {/* Top corner category badge */}
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          <span className={`px-2.5 py-0.5 rounded text-[9px] font-mono tracking-wider font-extrabold uppercase text-white shadow border border-white/20 ${
                            photo.category === 'highlights' 
                              ? isUNFTakeover ? 'bg-[#0A233F]' : 'bg-emerald-600'
                              : photo.category === 'competitions'
                              ? 'bg-amber-600'
                              : 'bg-indigo-600'
                          }`}>
                            {photo.category}
                          </span>
                          
                          {photo.isCustom && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-600 text-white uppercase tracking-wider shadow">
                              User File
                            </span>
                          )}
                        </div>

                        {/* Interactive Trash can for custom files only */}
                        {photo.isCustom && (
                          <button
                            onClick={(e) => deleteCustomItem(photo.id, e)}
                            className="absolute top-3 right-3 bg-red-650 hover:bg-red-700 hover:scale-105 transition-all text-white p-1.5 rounded shadow border border-red-500/30"
                            title="Remove uploaded image"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Photo description panel */}
                      <div className="p-4 flex-grow flex flex-col justify-between space-y-2">
                        <div>
                          <h4 className="text-sm font-extrabold text-[#0d1e57] group-hover:text-amber-600 transition-colors line-clamp-1">
                            {photo.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mt-0.5">
                            {photo.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100 font-mono">
                          <div className="flex items-center gap-1 min-w-0" title={`Uploaded by: ${photo.uploadedBy}`}>
                            <User className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{photo.uploadedBy || 'Delegate'}</span>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Calendar className="w-3 h-3" />
                            <span>{photo.date || 'Feb 2027'}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>

          {/* RIGHT PANEL: MOMENTS UPLOAD DESK (4 COLS) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#A7A8A9] uppercase block">
                Contribute Direct
              </span>
              <h3 className="text-lg font-black text-blue-900">
                Moment Submission Desk
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Choose a category below and drag-and-drop or select any PNG/JPG file to display in the instant gallery.
              </p>
            </div>

            {uploadSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 flex items-start gap-2.5 animate-scale-up text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold">Moment Added Successfully!</p>
                  <p className="text-[11px] text-emerald-700">Your snapshot is loaded instantly in the gallery grid on the left.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              
              {/* Photo Input (Drag active panel) */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  Select Photo File *
                </label>

                {uploadPreview ? (
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-900 border border-slate-250 shadow-sm group">
                    <img 
                      src={uploadPreview} 
                      alt="Uploading dynamic preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => {
                          setUploadPreview(null);
                          setUploadFile(null);
                        }}
                        className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1 shadow-md transition-all cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Clear Image</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      dragActive
                        ? 'border-emerald-500 bg-emerald-50/10'
                        : isUNFTakeover
                        ? 'border-[#0A233F]/40 hover:border-[#0A233F] hover:bg-[#0A233F]/5'
                        : 'border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/10'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700">Drag & Drop image here</p>
                    <p className="text-[10px] text-slate-400 mt-1">or click to browse local files</p>
                    <p className="text-[9px] text-slate-400 font-mono mt-0.5">PNG, JPG or WEBP (Max 8MB)</p>
                  </div>
                )}
              </div>

              {/* Title Field */}
              <div className="space-y-1">
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Traffic Bowl Champions Celebrating"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-sans outline-none focus:ring-1 focus:ring-slate-300 focus:bg-white"
                />
              </div>

              {/* Category Field */}
              <div className="space-y-1">
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  Summit Category
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-sans font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300"
                >
                  <option value="highlights">Event Highlights</option>
                  <option value="competitions">Competitions</option>
                  <option value="networking">Networking</option>
                </select>
              </div>

              {/* Contributor Name */}
              <div className="space-y-1">
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  Contributor Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria Gonzalez (UPR)"
                  value={uploadAuthor}
                  onChange={(e) => setUploadAuthor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-sans outline-none focus:ring-1 focus:ring-slate-300 focus:bg-white"
                />
              </div>

              {/* Description field */}
              <div className="space-y-1">
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  Photo Caption
                </label>
                <textarea
                  placeholder="Tell us about this snapshot and who is in it..."
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-sans outline-none focus:ring-1 focus:ring-slate-300 focus:bg-white resize-none"
                />
              </div>

              {/* Submit trigger */}
              <button
                type="submit"
                className="w-full text-white py-3 rounded-full text-xs font-bold font-sans transition-all shadow-md cursor-pointer flex items-center justify-center space-x-1"
                style={{ backgroundColor: isUNFTakeover ? '#0A233F' : '#10b981' }}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Submit Memory to Local Board</span>
              </button>

            </form>

            {/* Quick Informational Notice */}
            <div className="p-3 bg-slate-50 rounded-xl flex gap-2 text-[10px] text-slate-400 max-w-sm line-height-relaxed border border-slate-100">
              <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                Uploaded memories are stored locally in the current browser memory sandbox. Your original files will not be published online.
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* FULLSTAGE LIGHTBOX DIALOG */}
      {lightboxOpen && activeItem && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/98 flex flex-col justify-between p-4 animate-fade-in"
          onClick={closeLightbox}
        >
          {/* Top Panel Actions */}
          <div className="flex items-center justify-between p-2 text-white bg-slate-900/60 backdrop-blur rounded-2xl max-w-4xl w-full mx-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <p className="text-xs font-mono text-slate-300 tracking-wide font-bold">SLS SECURE TICKET VIEWER</p>
            </div>
            
            <div className="flex items-center gap-1.5">
              
              {/* Copy ref */}
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(activeItem.url);
                  alert('Image reference link copied to clipboard!');
                }}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                title="Copy link reference"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Close */}
              <button 
                onClick={closeLightbox}
                className="p-2 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-100 transition-all cursor-pointer flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

            </div>
          </div>

          {/* Core Display Arena with Prev / Next navigators */}
          <div className="flex-grow flex items-center justify-center max-w-7xl mx-auto w-full relative group">
            
            {/* Prev Image Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              className="absolute left-2 sm:left-4 z-10 bg-slate-900/70 hover:bg-slate-800 text-slate-100 w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer border border-slate-750"
              title="Previous snapshot (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Core Image container */}
            <div 
              className="max-h-[55vh] sm:max-h-[65vh] max-w-4xl w-auto overflow-hidden rounded-2xl shadow-inner border border-slate-800 relative bg-slate-950 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={activeItem.url} 
                alt={activeItem.title}
                className="max-h-[55vh] sm:max-h-[65vh] object-contain transition-all"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Next Image Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              className="absolute right-2 sm:right-4 z-10 bg-slate-900/70 hover:bg-slate-800 text-slate-100 w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer border border-slate-750"
              title="Next snapshot (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

          </div>

          {/* Bottom Metapage Detail Drawer */}
          <div 
            className="bg-slate-900 border border-slate-800 p-5 rounded-2xl max-w-4xl w-full mx-auto text-white space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono tracking-wider font-extrabold uppercase text-white shadow ${
                  activeItem.category === 'highlights' 
                    ? isUNFTakeover ? 'bg-[#0A233F]' : 'bg-emerald-600'
                    : activeItem.category === 'competitions'
                    ? 'bg-amber-600'
                    : 'bg-indigo-600'
                }`}>
                  {activeItem.category}
                </span>
                <h4 className="text-lg font-black text-white mt-1.5 leading-tight">{activeItem.title}</h4>
              </div>

              {/* Mock Download element */}
              <a 
                href={activeItem.url} 
                download={`ite-sls-${activeItem.title}.jpg`}
                onClick={(e) => {
                  // If it is custom, let the browser download. Otherwise alert nicely
                  if (!activeItem.isCustom) {
                    e.preventDefault();
                    alert('Mock downloading original full-resolution RAW snapshot...');
                  }
                }}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold text-white transition-all cursor-pointer ${
                  isUNFTakeover ? 'bg-[#0A233F] hover:bg-[#0A233F]/85' : 'bg-slate-805 hover:bg-slate-700'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save High-Res Snapshot</span>
              </a>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              {activeItem.description || 'No caption description provided for this Student Leadership Summit moment detail.'}
            </p>

            {/* Informational footer row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] text-slate-400 font-mono">
              <div className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Uploaded by: <strong className="text-slate-200">{activeItem.uploadedBy || 'District Delegate'}</strong></span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Event Date: <span className="text-slate-200">{activeItem.date || 'Feb 6, 2027'}</span></span>
              </div>
              <div className="flex items-center gap-1 ml-auto">
                <span className="text-slate-500">Navigation hint: use Left/Right arrows on keyboard</span>
              </div>
            </div>

          </div>

        </div>
      )}

    </section>
  );
}
