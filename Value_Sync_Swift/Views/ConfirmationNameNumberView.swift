import SwiftUI

// Player confirmation screen before discussion starts.
struct ConfirmationNameNumberView: View {
    @EnvironmentObject private var appState: AppState
    @State private var isManualPresented = false
    @State private var selectedPlayer: PlayerData?
    @State private var isNumberPresented = false
    @State private var activeAlert: ConfirmationAlert?
    let onNext: () -> Void

    // Localized string helper.
    private func t(_ key: String) -> String {
        Localizer.string(key, language: appState.language)
    }

    // Localized formatted string helper.
    private func tf(_ key: String, _ args: CVarArg...) -> String {
        Localizer.format(key, language: appState.language, args)
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                VStack(alignment: .leading, spacing: 12) {
                    Text(t("confirmation.theme_title"))
                        .font(.system(size: 22, weight: .bold))
                    VStack(alignment: .leading, spacing: 6) {
                        Text(appState.selectedTheme?.theme ?? t("common.unset"))
                            .font(.system(size: 18, weight: .bold))
                        Text(appState.selectedTheme?.metric ?? "")
                            .font(.system(size: 14))
                            .foregroundStyle(.secondary)
                    }
                    .padding(16)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(Color(.secondarySystemBackground))
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                }

                Text(t("confirmation.prompt"))
                    .font(.system(size: 18, weight: .semibold))
                    .multilineTextAlignment(.center)

                VStack(spacing: 12) {
                    if appState.playersData.isEmpty {
                        Text(t("confirmation.no_players"))
                            .font(.system(size: 16))
                            .foregroundStyle(.secondary)
                    } else {
                        ForEach(Array(appState.playersData.enumerated()), id: \.element.id) { index, player in
                            Button {
                                selectedPlayer = player
                                activeAlert = .confirmPlayer(player)
                            } label: {
                                HStack(spacing: 12) {
                                    Text("\(index + 1)")
                                        .font(.system(size: 18, weight: .bold))
                                        .foregroundStyle(Color(red: 0.13, green: 0.59, blue: 0.95))
                                    Text(player.name)
                                        .font(.system(size: 17, weight: .semibold))
                                    Spacer()
                                    Text(t("confirmation.tap_hint"))
                                        .font(.system(size: 13))
                                        .foregroundStyle(.secondary)
                                }
                                .padding(14)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .background(Color(.secondarySystemBackground))
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                            }
                            .buttonStyle(.plain)
                        }
                    }
                }

                DecisionButton(title: t("confirmation.next")) {
                    if let errorKey = appState.validateThemeSelected() {
                        activeAlert = .validation(t(errorKey))
                        return
                    }
                    if let errorKey = appState.validatePlayersData() {
                        activeAlert = .validation(t(errorKey))
                        return
                    }
                    onNext()
                }
                .padding(.top, 8)
            }
            .padding(20)
        }
        .background(Color(.systemBackground))
        .navigationTitle(t("confirmation.title"))
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button {
                    isManualPresented = true
                } label: {
                    Image(systemName: "questionmark.circle")
                        .font(.system(size: 20, weight: .regular))
                        .foregroundStyle(.primary)
                }
                .accessibilityLabel(t("accessibility.manual"))
            }
        }
        .sheet(isPresented: $isManualPresented) {
            ManualView()
        }
        .alert(item: $activeAlert) { alert in
            switch alert {
            case .confirmPlayer(let player):
                return Alert(
                    title: Text(t("confirmation.title")),
                    message: Text(tf("confirmation.is_player_format", player.name)),
                    primaryButton: .default(Text(t("common.yes"))) {
                        isNumberPresented = true
                    },
                    secondaryButton: .cancel(Text(t("common.no")))
                )
            case .validation(let message):
                return Alert(
                    title: Text(t("validation.title")),
                    message: Text(message),
                    dismissButton: .cancel(Text(t("common.ok")))
                )
            }
        }
        .sheet(isPresented: $isNumberPresented) {
            NumberDisplayView(number: selectedPlayer?.number ?? 0)
        }
        .onAppear {
            if appState.playersData.count != appState.numberOfPlayers {
                appState.assignNumbersToPlayers()
            }
        }
    }
}

enum ConfirmationAlert: Identifiable {
    case confirmPlayer(PlayerData)
    case validation(String)

    var id: String {
        switch self {
        case .confirmPlayer(let player):
            return "confirm-\(player.id)"
        case .validation(let message):
            return "validation-\(message)"
        }
    }
}

// Sheet that reveals the selected player's number.
struct NumberDisplayView: View {
    let number: Int
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject private var appState: AppState

    // Localized string helper.
    private func t(_ key: String) -> String {
        Localizer.string(key, language: appState.language)
    }

    var body: some View {
        VStack(spacing: 20) {
            Text(t("confirmation.number_title"))
                .font(.system(size: 20, weight: .bold))
            Text("\(number)")
                .font(.system(size: 48, weight: .bold))
                .foregroundStyle(Color(red: 0.13, green: 0.59, blue: 0.95))
            Button(t("confirmation.close")) {
                dismiss()
            }
            .buttonStyle(.borderedProminent)
        }
        .padding(24)
    }
}
