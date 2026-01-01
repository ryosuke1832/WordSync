import SwiftUI

// Ranking input screen with drag-to-reorder list.
struct ResultInputView: View {
    @EnvironmentObject private var appState: AppState
    @State private var players: [PlayerData] = []
    @State private var isManualPresented = false
    @State private var editMode: EditMode = .active
    @EnvironmentObject private var navigationState: NavigationState
    @State private var validationMessage: String?

    // Localized string helper.
    private func t(_ key: String) -> String {
        Localizer.string(key, language: appState.language)
    }

    private var isValidationPresented: Binding<Bool> {
        Binding(
            get: { validationMessage != nil },
            set: { newValue in
                if !newValue {
                    validationMessage = nil
                }
            }
        )
    }

    var body: some View {
        VStack(spacing: 16) {
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
            .padding(.horizontal, 20)

            Text(t("result_input.instruction"))
                .font(.system(size: 16, weight: .semibold))
                .multilineTextAlignment(.center)
                .padding(.horizontal, 20)

            List {
                ForEach(Array(players.enumerated()), id: \.element.id) { index, player in
                    HStack {
                        Text("\(index + 1)")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundStyle(.white)
                            .frame(width: 24, height: 24)
                            .background(Color(red: 0.13, green: 0.59, blue: 0.95))
                            .clipShape(Circle())
                        Text(player.name)
                            .font(.system(size: 17, weight: .semibold))
                        Spacer()
                    }
                    .padding(.vertical, 6)
                }
                .onMove { indices, newOffset in
                    players.move(fromOffsets: indices, toOffset: newOffset)
                }
            }
            .listStyle(.plain)
            .environment(\.editMode, $editMode)

            DecisionButton(title: t("result_input.confirm")) {
                if let errorKey = appState.validatePlayersData() {
                    validationMessage = t(errorKey)
                    return
                }
                if let errorKey = appState.validateResultInput(players) {
                    validationMessage = t(errorKey)
                    return
                }
                appState.submitUserAnswer(players)
                navigationState.path.append(AppRoute.resultPage)
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 24)
        }
        .background(Color(.systemBackground))
        .navigationTitle(t("result_input.title"))
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
        .alert(t("validation.title"), isPresented: isValidationPresented) {
            Button(t("common.ok"), role: .cancel) {
                validationMessage = nil
            }
        } message: {
            Text(validationMessage ?? "")
        }
        .onAppear {
            players = appState.playersData
            editMode = .active
        }
    }
}
