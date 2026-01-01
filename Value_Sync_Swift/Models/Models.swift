import SwiftUI

// Theme category metadata for UI display.
struct ThemeCategory: Identifiable, Hashable {
    let id: String
    let nameKey: String
    let icon: String
    let color: Color
}

// Single theme entry used throughout the game.
struct ThemeItem: Identifiable, Hashable {
    let id: String
    let theme: String
    let metric: String
    let categoryId: String
}

// JSON decoding model for raw theme data.
struct ThemeEntry: Decodable {
    let number: String
    let theme: String
    let evaluationMetric: String

    private enum CodingKeys: String, CodingKey {
        case number
        case theme
        case evaluationMetric = "evaluation_metric"
    }
}

// Player data paired with assigned number.
struct PlayerData: Identifiable, Hashable {
    let id: UUID
    let name: String
    let number: Int
}
