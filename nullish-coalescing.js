// Original
function mergeSettings(userSettings) {
  return {
    theme: userSettings.theme || "light",
    fontSize: userSettings.fontSize || 16,
    showNotifications: userSettings.notifications || true,
    language: userSettings.language || "de",
  };
}

// 3. Korrigierte Version
function mergeSettingsFixed(userSettings) {
  return {
    // "" ist kein gültiges Theme -> || ist hier sinnvoll
    theme: userSettings.theme || "light",
    // 0 könnte ein bewusst gesetzter Wert sein -> ??
    fontSize: userSettings.fontSize ?? 16,
    // false ist ein gültiger Wert und darf nicht überschrieben werden -> ??
    showNotifications: userSettings.notifications ?? true,
    // "" ist keine gültige Sprache, null soll auch den Default liefern -> || reicht
    language: userSettings.language || "de",
  };
}

// 1. Test
const input = { theme: "", fontSize: 0, notifications: false, language: null };
console.log("Original:", mergeSettings(input));
console.log("Fixed:   ", mergeSettingsFixed(input));

// 2. Welche Werte sind im Original falsch?
// - fontSize: 0 wird zu 16 (0 ist falsy)
// - showNotifications: false wird zu true (false ist falsy) -> der Nutzer
//   kann Benachrichtigungen nie ausschalten. Das ist der schlimmste Fehler.
// - theme: "" wird zu "light" (je nach Sicht ok, da "" kein gültiges Theme ist)
// - language: null wird zu "de" (korrekt)
// Ursache: || ersetzt jeden falsy-Wert (0, "", false, null, undefined),
// ?? ersetzt nur null und undefined.
