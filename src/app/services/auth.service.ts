import { Injectable, signal, computed } from '@angular/core';

export interface User {
  id: string;
  email: string;
  pseudo: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly STORAGE_KEY = 'marocguide_user';
  private userSignal = signal<User | null>(this.loadUser());

  /** L'utilisateur connecté (ou null) */
  readonly user = this.userSignal.asReadonly();

  /** true si un utilisateur est connecté */
  readonly isLoggedIn = computed(() => this.userSignal() !== null);

  /** Pseudo de l'utilisateur connecté (ou 'Voyageur') */
  readonly currentPseudo = computed(() => this.userSignal()?.pseudo ?? 'Voyageur');

  private loadUser(): User | null {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try { return JSON.parse(stored) as User; } catch { /* ignore */ }
    }
    return null;
  }

  private saveUser(user: User | null): void {
    if (user) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  /** Inscription */
  register(email: string, pseudo: string, password: string): { success: boolean; error?: string } {
    // Vérifier si l'email existe déjà
    const existing = localStorage.getItem(`marocguide_user_${email}`);
    if (existing) {
      return { success: false, error: 'Cet email est déjà utilisé.' };
    }

    // Stocker le mot de passe (version simplifiée — en production on hashe)
    localStorage.setItem(`marocguide_user_${email}`, JSON.stringify({ email, pseudo, password }));

    // Connecter l'utilisateur
    const user: User = { id: crypto.randomUUID().substring(0, 8), email, pseudo };
    this.userSignal.set(user);
    this.saveUser(user);
    return { success: true };
  }

  /** Connexion */
  login(email: string, password: string): { success: boolean; error?: string } {
    const stored = localStorage.getItem(`marocguide_user_${email}`);
    if (!stored) {
      return { success: false, error: 'Email ou mot de passe incorrect.' };
    }

    try {
      const data = JSON.parse(stored);
      if (data.password !== password) {
        return { success: false, error: 'Email ou mot de passe incorrect.' };
      }

      const user: User = { id: crypto.randomUUID().substring(0, 8), email, pseudo: data.pseudo };
      this.userSignal.set(user);
      this.saveUser(user);
      return { success: true };
    } catch {
      return { success: false, error: 'Erreur de connexion.' };
    }
  }

  /** Déconnexion */
  logout(): void {
    this.userSignal.set(null);
    this.saveUser(null);
  }
}
