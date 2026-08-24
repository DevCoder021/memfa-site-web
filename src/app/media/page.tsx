// src/app/media/page.tsx
"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import {
  PlayCircle,
  BookOpen,
  Radio,
  Newspaper,
  ArrowLeft,
  Search,
  ChevronRight,
  Calendar,
  User,
  Download,
  Eye,
  Clock
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getActualites, getLivres, getAudios, getLiveStatus } from "@/lib/api";

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Date non disponible";
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Fonction pour extraire l'ID de la vidéo YouTube
const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;
  
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/live\/([a-zA-Z0-9_-]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
};

// Fonction pour forcer le téléchargement d'un fichier
const handleDownload = async (fileUrl: string, fileName: string) => {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error("Erreur lors du téléchargement");
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'document.pdf';
    document.body.appendChild(link);
    link.click();
    
    // Safely remove the link from DOM
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erreur téléchargement:", error);
    window.open(fileUrl, '_blank');
  }
};

function MediaContent() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<any[]>([]);
  const [livres, setLivres] = useState<any[]>([]);
  const [audios, setAudios] = useState<any[]>([]);
  const [live, setLive] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [actualitesData, livresData, audiosData, liveData] = await Promise.all([
          getActualites(),
          getLivres(),
          getAudios(),
          getLiveStatus()
        ]);
        setArticles(actualitesData);
        setLivres(livresData);
        setAudios(audiosData);
        setLive(liveData);
      } catch (error) {
        console.error("Erreur chargement médias", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      const tl = gsap.timeline();
      tl.fromTo(headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 1, ease: "power4.out" }
      );
      
      gsap.fromTo(".media-card", 
        { opacity: 0, scale: 0.95, y: 20 }, 
        { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out", overwrite: true }
      );
    }
  }, [loading, activeCategory]);

  const categories = [
    { id: "all", label: "Tout", icon: null },
    { id: "news", label: "Actualités", icon: <Newspaper size={16} /> },
    { id: "lives", label: "Directs", icon: <PlayCircle size={16} /> },
    { id: "books", label: "Livres", icon: <BookOpen size={16} /> },
    { id: "audios", label: "Audios", icon: <Radio size={16} /> },
  ];

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredArticles = useMemo(() => {
    if (!normalizedQuery) return articles;

    return articles.filter((article) => {
      const haystack = [
        article.titre,
        article.contenu?.replace(/<[^>]+>/g, " "),
        article.date_evenement,
        article.date_publication,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [articles, normalizedQuery]);

  const filteredLivres = useMemo(() => {
    if (!normalizedQuery) return livres;

    return livres.filter((livre) => {
      const haystack = [
        livre.titre,
        livre.description,
        livre.auteur,
        livre.created_at,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [livres, normalizedQuery]);

  const filteredAudios = useMemo(() => {
    if (!normalizedQuery) return audios;

    return audios.filter((audio) => {
      const haystack = [
        audio.titre,
        audio.description,
        audio.speaker,
        audio.duration,
        audio.created_at,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [audios, normalizedQuery]);

  const filteredLive = useMemo(() => {
    if (!live) return null;
    if (!normalizedQuery) return live;

    const haystack = [
      live.titre,
      live.video_url,
      live.scheduled_for,
      live.is_active ? "direct live en cours" : "hors ligne prochain culte",
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery) ? live : null;
  }, [live, normalizedQuery]);

  const hasVisibleResults =
    (activeCategory === "all" || activeCategory === "news") && filteredArticles.length > 0 ||
    (activeCategory === "all" || activeCategory === "books") && filteredLivres.length > 0 ||
    (activeCategory === "all" || activeCategory === "audios") && filteredAudios.length > 0 ||
    (activeCategory === "all" || activeCategory === "lives") && !!filteredLive;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      
      {/* HEADER */}
      <header ref={headerRef} className="pt-32 pb-16 px-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#1a0f2b] mb-8 group transition-colors">
            <div className="p-2 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </div>
            Retour à l&apos;accueil
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-[#1a0f2b] tracking-tight">
                Médiathèque <span className="text-[#d97706]">.</span>
              </h1>
              <p className="text-xl text-gray-500 mt-4 max-w-2xl font-medium">
                Explorez nos dernières actualités, enseignements et ressources pour nourrir votre foi.
              </p>
            </div>
            
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une ressource..."
                className="w-full pl-12 pr-4 py-4 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1a0f2b]/10 transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-12 overflow-x-auto pb-4 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.id 
                    ? "bg-[#1a0f2b] text-white shadow-xl shadow-[#1a0f2b]/20 scale-105" 
                    : "bg-white border border-gray-200 text-gray-600 hover:border-[#1a0f2b] hover:text-[#1a0f2b]"
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* GRILLE DE CONTENU */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-white rounded-[2.5rem] h-[500px]"></div>
            ))}
          </div>
        ) : (
          <>
            {normalizedQuery && !hasVisibleResults && (
              <div className="mb-8 rounded-[2rem] border border-gray-200 bg-white px-6 py-5 text-sm text-gray-600 shadow-sm">
                Aucun résultat pour <span className="font-bold text-[#1a0f2b]">“{searchQuery}”</span>.
              </div>
            )}

            <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* --- SECTION ACTUALITÉS --- */}
            {(activeCategory === "all" || activeCategory === "news") && (
              <>
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article) => (
                    <div 
                      key={article.id} 
                      className="media-card group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500 flex flex-col"
                    >
                      <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#1a0f2b] shadow-sm">
                        Actualité
                      </div>
                      <div className="h-64 bg-gray-200 relative overflow-hidden">
                        {article.image_url ? (
                          <img 
                            src={`https://admin-memfa.site.je/public/${article.image_url}`} 
                            alt={article.titre} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-300 group-hover:scale-105 transition-transform duration-700 flex items-center justify-center">
                            <Newspaper size={48} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3 font-medium">
                          <Calendar size={14} />
                          {formatDate(article.date_evenement || article.date_publication)}
                        </div>
                        <h3 className="text-2xl font-bold text-[#1a0f2b] leading-tight mb-4 group-hover:text-[#d97706] transition-colors line-clamp-2">
                          {article.titre}
                        </h3>
                        <p className="text-gray-500 line-clamp-3 mb-6 text-sm leading-relaxed">
                          {article.contenu?.replace(/<[^>]+>/g, '').substring(0, 150)}...
                        </p>
                        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                          <Link href={`/media/${article.id}`} className="text-[#1a0f2b] font-bold flex items-center gap-2 hover:text-[#d97706] transition-colors">
                            Lire l&apos;article <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10 text-gray-500">
                    Aucune actualité publiée pour le moment.
                  </div>
                )}
              </>
            )}

            {/* --- SECTION LIVRES (DYNAMIQUE) --- */}
            {(activeCategory === "all" || activeCategory === "books") && (
              <>
                {filteredLivres.length > 0 ? (
                  filteredLivres.map((livre) => {
                    const fileUrl = `https://admin-memfa.site.je/public/${livre.file_path}`;
                    const fileName = livre.titre ? `${livre.titre.replace(/[^a-z0-9]/gi, '_')}.pdf` : 'document.pdf';
                    
                    return (
                      <div 
                        key={livre.id}
                        className="media-card group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500 flex flex-col"
                      >
                        <div className="h-64 bg-gray-200 relative overflow-hidden flex items-center justify-center">
                          {livre.cover_image ? (
                            <img 
                              src={`https://admin-memfa.site.je/public/${livre.cover_image}`} 
                              alt={livre.titre}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          ) : (
                            <div className="text-gray-400 text-center p-4">
                              <BookOpen size={48} className="mx-auto mb-2" />
                              <span className="text-sm">Pas de couverture</span>
                            </div>
                          )}
                          <div className="absolute top-4 right-4 z-10">
                            <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-700 shadow-sm">
                              PDF
                            </span>
                          </div>
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                          {livre.auteur && (
                            <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
                              <User size={12} /> {livre.auteur}
                            </p>
                          )}
                          <h3 className="text-xl font-bold text-[#1a0f2b] leading-tight mb-4 group-hover:text-[#d97706] transition-colors line-clamp-2">
                            {livre.titre}
                          </h3>
                          {livre.description && (
                            <p className="text-gray-500 text-sm line-clamp-3 mb-6">
                              {livre.description}
                            </p>
                          )}
                          <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <a 
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold text-[#1a0f2b] hover:text-[#d97706] flex items-center gap-1 transition-colors"
                                title="Voir le document"
                              >
                                <Eye size={14} /> Voir
                              </a>
                              <a 
                                href={fileUrl}
                                download={fileName}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDownload(fileUrl, fileName);
                                }}
                                className="text-xs font-bold text-[#d97706] hover:text-[#b45309] flex items-center gap-1 transition-colors cursor-pointer"
                                title="Télécharger le PDF"
                              >
                                <Download size={14} /> Télécharger
                              </a>
                            </div>
                            <span className="text-xs text-gray-400">
                              {formatDate(livre.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-10 text-gray-500">
                    Aucun livre disponible pour le moment.
                  </div>
                )}
              </>
            )}

            {/* --- SECTION AUDIOS (DYNAMIQUE) --- */}
            {(activeCategory === "all" || activeCategory === "audios") && (
              <>
                {filteredAudios.length > 0 ? (
                  filteredAudios.map((audio) => {
                    const fileUrl = `https://admin-memfa.site.je/public/${audio.file_path}`;
                    const fileName = audio.titre ? `${audio.titre.replace(/[^a-z0-9]/gi, '_')}.mp3` : 'audio.mp3';
                    
                    return (
                      <div 
                        key={audio.id}
                        className="media-card group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500 flex flex-col"
                      >
                        {/* En-tête audio */}
                        <div className="h-48 bg-gradient-to-br from-purple-500 to-memfa-violet relative flex items-center justify-center">
                          <Radio size={64} className="text-white/30" />
                          <div className="absolute top-4 right-4 z-10">
                            <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-700 shadow-sm">
                              Audio
                            </span>
                          </div>
                        </div>
                        
                        {/* Contenu */}
                        <div className="p-8 flex-1 flex flex-col">
                          {audio.speaker && (
                            <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
                              <User size={12} /> {audio.speaker}
                            </p>
                          )}
                          
                          <h3 className="text-xl font-bold text-[#1a0f2b] leading-tight mb-4 group-hover:text-[#d97706] transition-colors line-clamp-2">
                            {audio.titre}
                          </h3>
                          
                          {audio.description && (
                            <p className="text-gray-500 text-sm line-clamp-3 mb-6">
                              {audio.description}
                            </p>
                          )}
                          
                          {/* Lecteur audio simple */}
                          <div className="mt-auto pt-6 border-t border-gray-50">
                            <audio 
                              controls 
                              className="w-full h-10"
                              preload="metadata"
                            >
                              <source src={fileUrl} type="audio/mpeg" />
                              Votre navigateur ne supporte pas la lecture audio.
                            </audio>
                            
                            <div className="flex items-center justify-between mt-4">
                              <a 
                                href={fileUrl}
                                download={fileName}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDownload(fileUrl, fileName);
                                }}
                                className="text-xs font-bold text-[#d97706] hover:text-[#b45309] flex items-center gap-1 transition-colors cursor-pointer"
                                title="Télécharger l'audio"
                              >
                                <Download size={14} /> Télécharger
                              </a>
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Clock size={12} />
                                {audio.duration || formatDate(audio.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-10 text-gray-500">
                    Aucun audio disponible pour le moment.
                  </div>
                )}
              </>
            )}

            {/* --- SECTION LIVES (DYNAMIQUE) --- */}
            {(activeCategory === "all" || activeCategory === "lives") && (
              <>
                {filteredLive ? (
                  filteredLive.is_active && filteredLive.video_url ? (
                    <div className="media-card group relative bg-[#1a0f2b] rounded-[2.5rem] overflow-hidden h-full min-h-[500px] flex flex-col col-span-1 md:col-span-2 lg:col-span-2">
                      <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-red-600 px-4 py-2 rounded-full animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full" />
                        <span className="text-xs font-black text-white uppercase tracking-widest">En Direct</span>
                      </div>

                      <div className="flex-1 relative bg-black">
                        {filteredLive.video_url.includes('youtube.com') || filteredLive.video_url.includes('youtu.be') ? (
                          (() => {
                            const videoId = extractYouTubeId(filteredLive.video_url);
                            if (videoId) {
                              return (
                                <iframe
                                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1`}
                                  className="absolute inset-0 w-full h-full"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  allowFullScreen
                                  title="Live Stream"
                                  loading="lazy"
                                />
                              );
                            }
                            return null;
                          })()
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center p-8">
                            <div className="text-center text-white">
                              <p className="text-2xl font-bold mb-4">{filteredLive.titre}</p>
                              <a
                                href={filteredLive.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white px-6 py-3 rounded-full font-medium transition-all"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                                </svg>
                                Regarder sur Facebook
                              </a>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-8 bg-gradient-to-t from-black/80 to-transparent">
                        <h3 className="text-3xl font-bold text-white mb-2">{filteredLive.titre}</h3>
                        <p className="text-gray-300">
                          {filteredLive.scheduled_for ? `Programmé le ${formatDate(filteredLive.scheduled_for)}` : 'En direct maintenant'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="media-card group relative bg-[#1a0f2b] rounded-[2.5rem] overflow-hidden h-full min-h-[400px] flex flex-col justify-end p-8 text-white border border-white/10 shadow-xl col-span-1 md:col-span-2 lg:col-span-1">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                      <div className="absolute inset-0 bg-gray-800 opacity-50" />
                      <div className="relative z-20">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="w-2 h-2 bg-gray-500 rounded-full" />
                          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Hors ligne</span>
                        </div>
                        <h3 className="text-3xl font-bold mb-4 leading-tight">Aucun direct en cours</h3>
                        <p className="text-gray-300 mb-6 text-sm">Rejoignez-nous pendant nos cultes dominicaux pour un temps de louange puissant.</p>
                        <div className="text-sm text-gray-400">
                          <p>Prochain culte : Dimanche 08h30</p>
                        </div>
                      </div>
                    </div>
                  )
                ) : null}
              </>
            )}

            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function MediaPage() {
  return (
    <Suspense fallback={null}>
      <MediaContent />
    </Suspense>
  );
}