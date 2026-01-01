import SwiftUI

// Player name entry screen.
struct MemberNameSettingView: View {
    @EnvironmentObject private var appState: AppState
    @State private var isManualPresented = false
    @State private var validationMessage: String?
    let onNext: () -> Void

    // Localized string helper.
    private func t(_ key: String) -> String {
        Localizer.string(key, language: appState.language)
    }

    // Localized formatted string helper.
    private func tf(_ key: String, _ args: CVarArg...) -> String {
        Localizer.format(key, language: appState.language, args)
    }

    private func validationText(_ key: String) -> String {
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
        ScrollView {
            VStack(spacing: 16) {
                Text(t("member_name.prompt"))
                    .font(.system(size: 22, weight: .bold))
                    .multilineTextAlignment(.center)
                    .padding(.vertical, 12)

                ForEach(appState.playerNames.indices, id: \.self) { index in
                    VStack(alignment: .leading, spacing: 8) {
                        Text(tf("member_name.player_label_format", index + 1))
                            .font(.system(size: 16, weight: .semibold))
                        TextField(
                            tf("member_name.placeholder_format", index + 1),
                            text: bindingForName(at: index)
                        )
                        .textFieldStyle(.roundedBorder)
                    }
                }

                DecisionButton(title: t("decision.confirm")) {
                    if let errorKey = appState.validatePlayerNames() {
                        validationMessage = validationText(errorKey)
                        return
                    }
                    onNext()
                }
                .padding(.top, 8)
            }
            .padding(20)
        }
        .background(Color(.systemBackground))
        .navigationTitle(t("member_name.title"))
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
        .alert(validationText("validation.title"), isPresented: isValidationPresented) {
            Button(t("common.ok"), role: .cancel) {
                validationMessage = nil
            }
        } message: {
            Text(validationMessage ?? "")
        }
        .onAppear {
            if appState.playerNames.count != appState.numberOfPlayers {
                appState.resetPlayerNames()
            }
        }
    }

    // Binds a name field with default-name behavior.
    private func bindingForName(at index: Int) -> Binding<String> {
        Binding(
            get: {
                guard appState.playerNames.indices.contains(index) else {
                    return ""
                }
                let defaultName = appState.defaultPlayerName(index + 1)
                let currentName = appState.playerNames[index]
                return currentName == defaultName ? "" : currentName
            },
            set: { newValue in
                guard appState.playerNames.indices.contains(index) else {
                    return
                }
                let trimmed = newValue.trimmingCharacters(in: .whitespacesAndNewlines)
                let defaultName = appState.defaultPlayerName(index + 1)
                appState.playerNames[index] = trimmed.isEmpty ? defaultName : newValue
            }
        )
    }
}
