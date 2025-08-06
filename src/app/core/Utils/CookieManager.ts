export class CookieManager {
  // Method to set a cookie
  static setCookie(name: string, value: string, days: number = 7): void {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; expires=${expires}; path=/`;
  }
  // Method to get a cookie by name
  static getCookie(name: string): string | null {
    if (typeof document === 'undefined') {
      return null; // Return null if document is not available (e.g., during server-side rendering)
    }
    const match = document.cookie.match(
      new RegExp('(^| )' + name + '=([^;]+)')
    );
    return match ? match[2] : null;
  }

  // Method to delete a cookie by name
  static deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
}
