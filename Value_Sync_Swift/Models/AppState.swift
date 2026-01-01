import Foundation

// Global app state shared across screens.
final class AppState: ObservableObject {
    @Published var numberOfPlayers: Int = 3
    @Published var playerNames: [String] = []
    @Published var selectedTheme: ThemeItem?
    @Published var playersData: [PlayerData] = []
    @Published var userAnswer: [PlayerData] = []
    @Published var correctOrder: [PlayerData] = []
    @Published var language: AppLanguage = .japanese

    init() {
        resetPlayerNames()
    }

    // Default player name based on current language.
    func defaultPlayerName(_ index: Int) -> String {
        let base = language == .english ? "Player" : "ユーザー"
        return "\(base)\(index)"
    }

    // Resets player names to defaults for the current player count.
    func resetPlayerNames() {
        playerNames = (1...numberOfPlayers).map { defaultPlayerName($0) }
    }

    // Assigns unique random numbers to each player.
    func assignNumbersToPlayers() {
        let numbers = Array(1...100).shuffled().prefix(numberOfPlayers)
        playersData = zip(playerNames, numbers).map { name, number in
            PlayerData(id: UUID(), name: name, number: number)
        }
    }

    // Stores user order and computes the correct order for results.
    func submitUserAnswer(_ finalOrder: [PlayerData]) {
        userAnswer = finalOrder
        correctOrder = playersData.sorted { $0.number < $1.number }
    }

    // Full reset to initial state.
    func resetGame() {
        numberOfPlayers = 3
        playerNames = (1...numberOfPlayers).map { defaultPlayerName($0) }
        selectedTheme = nil
        playersData = []
        userAnswer = []
        correctOrder = []
    }

    // Reset while keeping the current player list.
    func resetGameKeepPlayers() {
        selectedTheme = nil
        playersData = []
        userAnswer = []
        correctOrder = []
        if playerNames.isEmpty {
            numberOfPlayers = 3
            resetPlayerNames()
        } else {
            numberOfPlayers = playerNames.count
        }
    }

    // Validates the configured player count.
    func validatePlayerCount() -> String? {
        if numberOfPlayers < 3 || numberOfPlayers > 10 {
            return "validation.player_count_range"
        }
        return nil
    }

    // Validates player names for count, empties, and duplicates.
    func validatePlayerNames() -> String? {
        if playerNames.count != numberOfPlayers {
            return "validation.player_count_mismatch"
        }
        let trimmed = playerNames.map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }
        if trimmed.contains(where: { $0.isEmpty }) {
            return "validation.player_name_empty"
        }
        let lowered = trimmed.map { $0.lowercased() }
        if Set(lowered).count != lowered.count {
            return "validation.player_name_duplicate"
        }
        return nil
    }

    // Validates theme selection exists.
    func validateThemeSelected() -> String? {
        if selectedTheme == nil {
            return "validation.theme_missing"
        }
        return nil
    }

    // Validates that player data is ready with numbers.
    func validatePlayersData() -> String? {
        if playersData.count != numberOfPlayers {
            return "validation.players_data_missing"
        }
        return nil
    }

    // Validates result input ordering.
    func validateResultInput(_ order: [PlayerData]) -> String? {
        if order.count != numberOfPlayers {
            return "validation.result_count_mismatch"
        }
        return nil
    }

    // Validates that results are available to display.
    func validateResultsReady() -> String? {
        if userAnswer.isEmpty || correctOrder.isEmpty {
            return "validation.results_missing"
        }
        if userAnswer.count != correctOrder.count {
            return "validation.results_mismatch"
        }
        return nil
    }
}
