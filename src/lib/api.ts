// src/lib/api.ts
// Toutes les fonctions pointent maintenant vers la base de données locale
// (Neon/Prisma), plus vers l'ancien CMS PHP externe.

export async function getActualites() {
  try {
    const res = await fetch(`/api/actualites`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch actualites: ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Erreur lors du chargement des actualités:", error instanceof Error ? error.message : error);
    return [];
  }
}

export async function getActualiteById(id: string) {
  try {
    const res = await fetch(`/api/actualites/${encodeURIComponent(id)}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch actualite");
    return await res.json();
  } catch (error) {
    console.error("Erreur lors du chargement de l'article:", error);
    return null;
  }
}

export async function getLivres() {
  try {
    const res = await fetch(`/api/livres`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch livres");
    return await res.json();
  } catch (error) {
    console.error("Erreur lors du chargement des livres:", error);
    return [];
  }
}

export async function getAudios() {
  try {
    const res = await fetch(`/api/audios`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch audios");
    return await res.json();
  } catch (error) {
    console.error("Erreur lors du chargement des audios:", error);
    return [];
  }
}

// Le back-office renvoie { isActive, videoUrl, titre, ... } (camelCase, Prisma).
// On garde ici le même format qu'avant (is_active, video_url...) pour ne rien
// casser dans les composants qui consomment déjà getLiveStatus().
export async function getLiveStatus() {
  try {
    const res = await fetch(`/api/live`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch live status: ${res.status}`);
    const live = await res.json();

    if (!live) {
      return {
        is_active: false,
        titre: undefined,
        video_url: "",
        scheduled_for: undefined,
      };
    }

    return {
      is_active: live.isActive,
      titre: live.titre,
      video_url: live.videoUrl,
      scheduled_for: live.scheduledFor,
    };
  } catch (error) {
    console.error("Erreur lors du chargement du live:", error instanceof Error ? error.message : error);
    return {
      is_active: false,
      titre: undefined,
      video_url: "",
      scheduled_for: undefined,
    };
  }
}