// src/lib/api.ts
const API_URL = '/api/memfa';

export async function getActualites() {
  try {
    const res = await fetch(`${API_URL}?action=getActualites`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`Failed to fetch actualites: ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erreur lors du chargement des actualités:", error.message);
    } else {
      console.error("Erreur lors du chargement des actualités:", error);
    }
    return [];
  }
}

export async function getActualiteById(id: string) {
  try {
    const res = await fetch(`${API_URL}?action=getActualiteById&id=${encodeURIComponent(id)}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error('Failed to fetch actualite');
    return await res.json();
  } catch (error) {
    console.error("Erreur lors du chargement de l'article:", error);
    return null;
  }
}

export async function getLivres() {
  try {
    const res = await fetch(`${API_URL}?action=getLivres`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error('Failed to fetch livres');
    return await res.json();
  } catch (error) {
    console.error("Erreur lors du chargement des livres:", error);
    return [];
  }
}

// NOUVELLE FONCTION : Récupérer les audios
export async function getAudios() {
  try {
    const res = await fetch(`${API_URL}?action=getAudios`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error('Failed to fetch audios');
    return await res.json();
  } catch (error) {
    console.error("Erreur lors du chargement des audios:", error);
    return [];
  }
}

// NOUVELLE FONCTION : Récupérer le statut du live
export async function getLiveStatus() {
  try {
    const res = await fetch(`${API_URL}?action=getLiveStatus`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`Failed to fetch live status: ${res.status}`);
    const data = await res.json();
    return data && typeof data === 'object' ? data : { is_active: false };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erreur lors du chargement du live:", error.message);
    } else {
      console.error("Erreur lors du chargement du live:", error);
    }
    return { is_active: false };
  }
}