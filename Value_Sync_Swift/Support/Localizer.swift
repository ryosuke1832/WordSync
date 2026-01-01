import Foundation

// Supported in-app languages.
enum AppLanguage: String {
    case japanese = "ja"
    case english = "en"

    var code: String { rawValue }
}

// Lightweight localization helper that reads strings from specific bundles.
enum Localizer {
    // Returns a localized string for the given key and language.
    static func string(_ key: String, language: AppLanguage) -> String {
        if let path = Bundle.main.path(forResource: language.code, ofType: "lproj"),
           let bundle = Bundle(path: path) {
            return NSLocalizedString(key, bundle: bundle, comment: "")
        }
        return NSLocalizedString(key, comment: "")
    }

    // Formats a localized string with variadic arguments.
    static func format(_ key: String, language: AppLanguage, _ args: CVarArg...) -> String {
        let format = string(key, language: language)
        return String(format: format, locale: Locale(identifier: language.code), arguments: args)
    }

    // Formats a localized string with a prebuilt argument list.
    static func format(_ key: String, language: AppLanguage, _ args: [CVarArg]) -> String {
        let format = string(key, language: language)
        return String(format: format, locale: Locale(identifier: language.code), arguments: args)
    }
}
