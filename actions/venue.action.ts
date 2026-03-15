"use server";

export async function toggleVenueFavorite(venueId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ venueId }),
  });
  return res.json();
}

export async function removeVenueFavorite(venueId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/favorites?venueId=${venueId}`, {
    method: 'DELETE',
  });
  return res.json();
}

export async function checkVenueFavorite(venueId: string, userFavorites: any[]) {
  return userFavorites.some(fav => fav.venueId === venueId);
}
