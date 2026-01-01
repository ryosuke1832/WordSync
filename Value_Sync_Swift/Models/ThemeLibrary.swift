import Foundation
import SwiftUI

// Loads theme data from bundled JSON and provides category metadata.
enum ThemeLibrary {
    static let categories: [ThemeCategory] = [
        ThemeCategory(id: "theme1", nameKey: "category.theme1", icon: "star.fill", color: Color(red: 1.0, green: 0.84, blue: 0.0)),
        ThemeCategory(id: "theme2", nameKey: "category.theme2", icon: "heart.fill", color: Color(red: 1.0, green: 0.41, blue: 0.71)),
        ThemeCategory(id: "theme3", nameKey: "category.theme3", icon: "trophy.fill", color: Color(red: 0.30, green: 0.69, blue: 0.31)),
        ThemeCategory(id: "theme4", nameKey: "category.theme4", icon: "gamecontroller.fill", color: Color(red: 0.13, green: 0.59, blue: 0.95))
    ]

    // Returns all themes for the given language.
    static func allThemes(for language: AppLanguage) -> [ThemeItem] {
        loadThemes(language: language)
    }

    // Reads themes from JSON; falls back to minimal defaults on failure.
    private static func loadThemes(language: AppLanguage) -> [ThemeItem] {
        guard let url = locateThemesURL(language: language) else {
            #if DEBUG
            print("themes.json not found in bundle resources.")
            #endif
            return fallbackThemes()
        }

        do {
            let data = try Data(contentsOf: url)
            let decoded = try JSONDecoder().decode([String: [ThemeEntry]].self, from: data)
            let orderedKeys = ["theme1", "theme2", "theme3", "theme4"]
            return orderedKeys.flatMap { key in
                (decoded[key] ?? []).map { entry in
                    ThemeItem(
                        id: "\(key)-\(entry.number)",
                        theme: entry.theme,
                        metric: entry.evaluationMetric,
                        categoryId: key
                    )
                }
            }
        } catch {
            #if DEBUG
            print("Failed to decode themes.json: \(error)")
            #endif
            return fallbackThemes()
        }
    }

    // Attempts to find the themed JSON file in the app bundle.
    private static func locateThemesURL(language: AppLanguage) -> URL? {
        let baseName = language == .english ? "themes_en" : "themes"
        if let url = Bundle.main.url(forResource: baseName, withExtension: "json") {
            return url
        }

        if let url = Bundle.main.url(forResource: baseName, withExtension: "json", subdirectory: "Value_Sync_Swift") {
            return url
        }

        if let urls = Bundle.main.urls(forResourcesWithExtension: "json", subdirectory: nil) {
            let targetName = "\(baseName).json"
            if let match = urls.first(where: { $0.lastPathComponent == targetName }) {
                return match
            }
        }

        if let urls = Bundle.main.urls(forResourcesWithExtension: "json", subdirectory: "Value_Sync_Swift") {
            let targetName = "\(baseName).json"
            if let match = urls.first(where: { $0.lastPathComponent == targetName }) {
                return match
            }
        }

        return nil
    }

    // Minimal fallback set used when JSON is missing.
    private static func fallbackThemes() -> [ThemeItem] {
        [
            ThemeItem(id: "t1-1", theme: "コンビニの商品の人気", metric: "1:人気ない-100:人気ある", categoryId: "theme1"),
            ThemeItem(id: "t1-2", theme: "飲食店の人気", metric: "1:人気ない-100:人気ある", categoryId: "theme1"),
            ThemeItem(id: "t2-1", theme: "美しいもの", metric: "1:美しくない-100:美しい", categoryId: "theme2"),
            ThemeItem(id: "t3-1", theme: "なりたい生き物", metric: "1:なりたくない-100:なりたい", categoryId: "theme3"),
            ThemeItem(id: "t4-1", theme: "無人島に持っていきたいもの", metric: "1:いらない-100:持っていきたい", categoryId: "theme4")
        ]
    }
}
