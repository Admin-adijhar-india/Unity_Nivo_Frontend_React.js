import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Image, FormInput, Plus, Trash2, Edit, Save, Compass, Award, FileText, CheckCircle2 } from 'lucide-react';

export default function Website() {
  const { 
    websiteContent, 
    saveCarouselItem, 
    deleteCarouselItem, 
    saveTopAchiever, 
    deleteTopAchiever, 
    updateWebsiteInfo 
  } = useContext(AppContext);

  const [activeSubTab, setActiveSubTab] = useState('carousel');
  const [successMsg, setSuccessMsg] = useState('');

  // Editing state for Carousel
  const [editSlide, setEditSlide] = useState(null);
  const [isAddingSlide, setIsAddingSlide] = useState(false);

  // Editing state for Achiever
  const [editAchiever, setEditAchiever] = useState(null);
  const [isAddingAchiever, setIsAddingAchiever] = useState(false);

  // Text inputs for basic content
  const [aboutText, setAboutText] = useState(websiteContent.aboutUs);
  const [servicesText, setServicesText] = useState(websiteContent.services);
  const [contactInfo, setContactInfo] = useState({
    phone: websiteContent.contact.phone,
    email: websiteContent.contact.email,
    address: websiteContent.contact.address
  });

  const triggerSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Carousel actions
  const handleSaveSlideSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const item = {
      id: editSlide ? editSlide.id : Date.now(),
      image: data.get('image'),
      title: data.get('title'),
      text: data.get('text'),
      buttonText: data.get('buttonText'),
      activePeriod: data.get('activePeriod')
    };
    saveCarouselItem(item);
    setEditSlide(null);
    setIsAddingSlide(false);
    triggerSuccess('Promotional slide saved successfully.');
  };

  // Achiever actions
  const handleSaveAchieverSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const item = {
      id: editAchiever ? editAchiever.id : Date.now(),
      name: data.get('name'),
      rank: data.get('rank').toUpperCase(),
      displayInfo: data.get('displayInfo'),
      image: data.get('image')
    };
    saveTopAchiever(item);
    setEditAchiever(null);
    setIsAddingAchiever(false);
    triggerSuccess('Top Achiever profile saved.');
  };

  // Basic Page Actions
  const handleSaveBasicPages = () => {
    updateWebsiteInfo('aboutUs', aboutText);
    updateWebsiteInfo('services', servicesText);
    // update contact fields
    updateWebsiteInfo('contact', contactInfo);
    triggerSuccess('Homepage text sections updated.');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Sub Tabs Selection */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div className="flex space-x-1.5 p-1 rounded-xl bg-black/20 border border-white/5">
          <button
            onClick={() => setActiveSubTab('carousel')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center ${
              activeSubTab === 'carousel' ? 'bg-gold text-darkbg shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Compass size={13} className="mr-1.5" /> Promotional Carousel
          </button>
          <button
            onClick={() => setActiveSubTab('achievers')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center ${
              activeSubTab === 'achievers' ? 'bg-gold text-darkbg shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Award size={13} className="mr-1.5" /> Top Achievers
          </button>
          <button
            onClick={() => setActiveSubTab('basicinfo')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center ${
              activeSubTab === 'basicinfo' ? 'bg-gold text-darkbg shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileText size={13} className="mr-1.5" /> Basic Pages Text
          </button>
        </div>

        {/* Success Banner */}
        {successMsg && (
          <div className="flex items-center text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl font-bold animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 size={13} className="mr-1.5 animate-pulse" /> {successMsg}
          </div>
        )}
      </div>

      {/* SUB TAB: Promotional Carousel */}
      {activeSubTab === 'carousel' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Promotional Banners List</h3>
              <p className="text-xs text-gray-500">Carousel cards shown on the website home screen hero banner</p>
            </div>
            {!isAddingSlide && !editSlide && (
              <button
                onClick={() => setIsAddingSlide(true)}
                className="px-3.5 py-1.5 bg-gold text-darkbg font-bold rounded-xl flex items-center hover:bg-gold-light text-xs transition-colors"
              >
                <Plus size={14} className="mr-1.5" /> Add Slide
              </button>
            )}
          </div>

          {/* Slide Editor / Form */}
          {(isAddingSlide || editSlide) && (
            <form onSubmit={handleSaveSlideSubmit} className="p-5 rounded-2xl border border-white/10 bg-black/40 space-y-4 max-w-xl animate-in slide-in-from-top-4">
              <h4 className="text-xs font-bold text-gold uppercase tracking-wider">
                {isAddingSlide ? 'Create New Promotional Offer' : 'Edit Banner Offer Details'}
              </h4>
              <div className="grid grid-cols-1 gap-4 text-xs">
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Banner Title</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editSlide ? editSlide.title : ''}
                    required
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Banner Paragraph Text</label>
                  <textarea
                    name="text"
                    defaultValue={editSlide ? editSlide.text : ''}
                    required
                    rows="3"
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 font-bold block mb-1">Button Call to Action</label>
                    <input
                      type="text"
                      name="buttonText"
                      defaultValue={editSlide ? editSlide.buttonText : 'JOIN NOW'}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 font-bold block mb-1">Active Duration (Period)</label>
                    <input
                      type="text"
                      name="activePeriod"
                      defaultValue={editSlide ? editSlide.activePeriod : '2026-08-01 to 2026-12-31'}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Banner Graphic / Image URL</label>
                  <input
                    type="text"
                    name="image"
                    defaultValue={editSlide ? editSlide.image : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800'}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingSlide(false);
                    setEditSlide(null);
                  }}
                  className="px-4 py-2 border border-white/10 hover:bg-white/5 rounded-xl text-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gold text-darkbg font-bold hover:bg-gold-light rounded-xl flex items-center"
                >
                  <Save size={13} className="mr-1.5" /> Save Banner
                </button>
              </div>
            </form>
          )}

          {/* Slide List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {websiteContent.carousel.map((slide) => (
              <div key={slide.id} className="rounded-2xl border border-white/5 glass-panel overflow-hidden flex flex-col justify-between">
                <div className="h-44 relative bg-slate-900">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-darkbg-card to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[9px] font-bold text-gold uppercase tracking-widest bg-gold/10 border border-gold/20 px-2 py-0.5 rounded">
                      Slide {slide.id}
                    </span>
                    <h4 className="text-sm font-extrabold text-white mt-1.5 leading-snug">{slide.title}</h4>
                  </div>
                </div>
                <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-gray-400 leading-relaxed flex-1">{slide.text}</p>
                  
                  <div className="space-y-2 border-t border-white/5 pt-3.5 text-xs text-gray-500">
                    <div className="flex justify-between"><span>Button Text:</span><span className="font-semibold text-gray-300">{slide.buttonText}</span></div>
                    <div className="flex justify-between"><span>Valid Period:</span><span className="font-semibold text-gray-300">{slide.activePeriod}</span></div>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-2 text-xs border-t border-white/5">
                    <button
                      onClick={() => setEditSlide(slide)}
                      className="px-2.5 py-1 rounded bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 flex items-center"
                    >
                      <Edit size={12} className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this promotional slide?')) {
                          deleteCarouselItem(slide.id);
                          triggerSuccess('Promotional slide deleted.');
                        }
                      }}
                      className="px-2.5 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 flex items-center"
                    >
                      <Trash2 size={12} className="mr-1" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB: Top Achievers */}
      {activeSubTab === 'achievers' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Top Achievers List</h3>
              <p className="text-xs text-gray-500">Profiles displayed on the landing page achievers carousel</p>
            </div>
            {!isAddingAchiever && !editAchiever && (
              <button
                onClick={() => setIsAddingAchiever(true)}
                className="px-3.5 py-1.5 bg-gold text-darkbg font-bold rounded-xl flex items-center hover:bg-gold-light text-xs transition-colors"
              >
                <Plus size={14} className="mr-1.5" /> Add Achiever
              </button>
            )}
          </div>

          {/* Achiever Form */}
          {(isAddingAchiever || editAchiever) && (
            <form onSubmit={handleSaveAchieverSubmit} className="p-5 rounded-2xl border border-white/10 bg-black/40 space-y-4 max-w-xl animate-in slide-in-from-top-4">
              <h4 className="text-xs font-bold text-gold uppercase tracking-wider">
                {isAddingAchiever ? 'Register Top Achiever profile' : 'Edit Achiever details'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Achiever Full Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editAchiever ? editAchiever.name : ''}
                    required
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Rank Title</label>
                  <select
                    name="rank"
                    defaultValue={editAchiever ? editAchiever.rank : 'Gold'}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="GOLD">GOLD</option>
                    <option value="PLATINUM">PLATINUM</option>
                    <option value="DIAMOND">DIAMOND</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Business Stats Details</label>
                  <input
                    type="text"
                    name="displayInfo"
                    defaultValue={editAchiever ? editAchiever.displayInfo : 'Business $35,000'}
                    placeholder="e.g. Business $35,000"
                    required
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Avatar Image URL</label>
                  <input
                    type="text"
                    name="image"
                    defaultValue={editAchiever ? editAchiever.image : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingAchiever(false);
                    setEditAchiever(null);
                  }}
                  className="px-4 py-2 border border-white/10 hover:bg-white/5 rounded-xl text-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gold text-darkbg font-bold hover:bg-gold-light rounded-xl flex items-center"
                >
                  <Save size={13} className="mr-1.5" /> Save Achiever
                </button>
              </div>
            </form>
          )}

          {/* Achievers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {websiteContent.topAchievers.map((ach) => (
              <div key={ach.id} className="p-5 rounded-2xl border border-white/5 glass-panel flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-full border-2 border-gold/40 overflow-hidden shadow-lg">
                    <img
                      src={ach.image}
                      alt={ach.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{ach.name}</h4>
                    <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-gold/15 border border-gold/30 text-gold mb-1">
                      {ach.rank}
                    </span>
                    <p className="text-xs text-gray-500">{ach.displayInfo}</p>
                  </div>
                </div>

                <div className="flex flex-col space-y-1 text-xs">
                  <button
                    onClick={() => setEditAchiever(ach)}
                    className="p-1 text-gray-400 hover:text-white rounded hover:bg-white/5 transition-all"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove ${ach.name} from Achievers list?`)) {
                        deleteTopAchiever(ach.id);
                        triggerSuccess('Achiever removed.');
                      }
                    }}
                    className="p-1 text-red-400 hover:text-red-500 rounded hover:bg-white/5 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB: Basic Info */}
      {activeSubTab === 'basicinfo' && (
        <div className="space-y-6 max-w-2xl">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Homepage Basic Text</h3>
            <p className="text-xs text-gray-500">Edit generic informational blocks regarding company profiles and customer support</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-gray-400 font-bold block mb-1">About Us Section</label>
              <textarea
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                rows="4"
                className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white leading-relaxed"
              />
            </div>

            <div>
              <label className="text-gray-400 font-bold block mb-1">Services/What We Do Section</label>
              <textarea
                value={servicesText}
                onChange={(e) => setServicesText(e.target.value)}
                rows="4"
                className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white leading-relaxed"
              />
            </div>

            <div className="border-t border-white/5 pt-4 space-y-3.5">
              <h4 className="text-xs font-bold text-gold uppercase tracking-wider">Contact Coordinates</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Support Phone</label>
                  <input
                    type="text"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-400 font-bold block mb-1">Support Email</label>
                  <input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 font-bold block mb-1">HQ Address</label>
                <input
                  type="text"
                  value={contactInfo.address}
                  onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSaveBasicPages}
                className="px-4 py-2 bg-gold text-darkbg font-bold hover:bg-gold-light rounded-xl flex items-center"
              >
                <Save size={13} className="mr-1.5" /> Save Website Text
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
