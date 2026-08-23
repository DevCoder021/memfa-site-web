// src/app/media/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getActualiteById } from "@/lib/api";

interface Article {
  titre: string;
  contenu: string;
  image_url?: string;
  date_evenement?: string;
  date_publication?: string;
  date?: string;
}

const formatDate = (dateString: string | undefined | null) => {
  if (!dateString) return "Date non spécifiée";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Date invalide";
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};

export default function ArticleDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchArticle = async () => {
      try {
        setArticle(await getActualiteById(id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticle();
  }, [id]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-[#1a0f2b] mb-4">Article introuvable</h2>
        <Link href="/media" className="text-[#d97706] hover:underline">
          ← Retour à la médiathèque
        </Link>
      </div>
    );
  }

  const displayDate = article.date_evenement || article.date_publication || article.date;

  return (
    <div className="min-h-screen bg-white pb-24">
      
      {/* HEADER */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/media" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a0f2b]">
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Retour</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={handleShare}>
            {copied ? <Check className="text-green-500" size={20} /> : <Share2 size={20} />}
          </Button>
        </div>
      </header>

      {/* CONTENU */}
      <main className="max-w-3xl mx-auto px-6 pt-12">
        
        {/* Meta */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-[#d97706] font-bold uppercase tracking-widest mb-4">
            <span className="bg-[#d97706]/10 px-3 py-1 rounded-full">Actualité</span>
            <span>•</span>
            <span className="text-gray-500 flex items-center gap-1">
              <Calendar size={12} />
              {formatDate(displayDate)}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a0f2b] leading-tight">
            {article.titre}
          </h1>
        </div>

        {/* Image */}
        {article.image_url && (
          <div className="w-full aspect-video bg-gray-100 rounded-[2rem] overflow-hidden mb-12">
            <img 
              src={`http://localhost/memfa-api/public/${article.image_url}`} 
              alt={article.titre}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Contenu HTML */}
        <div 
          className="prose prose-lg max-w-none text-gray-600"
          dangerouslySetInnerHTML={{ __html: article.contenu }}
        />

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-100 flex justify-end">
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a0f2b]"
          >
            <Copy size={16} />
            {copied ? "Copié !" : "Copier le lien"}
          </button>
        </footer>

      </main>
    </div>
  );
}