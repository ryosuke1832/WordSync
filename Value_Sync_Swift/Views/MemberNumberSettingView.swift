import SwiftUI

// Player count selection screen.
struct MemberNumberSettingView: View {
    @EnvironmentObject private var appState: AppState
    @State private var isManualPresented = false
    @State private var validationMessage: String?
    private let numbers = Array(3...10)
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
        VStack(spacing: 0) {
            VStack(spacing: 8) {
                Text(t("member_number.prompt"))
                    .font(.system(size: 22, weight: .bold))
                    .padding(.top, 12)
                Text(t("member_number.range_hint"))
                    .font(.system(size: 14))
                    .foregroundStyle(.secondary)
            }
            .frame(maxWidth: .infinity)
            .padding(.bottom, 12)

            GeometryReader { proxy in
                let cellWidth = (proxy.size.width - 40) / 3

                LazyVGrid(
                    columns: Array(repeating: GridItem(.flexible(), spacing: 10), count: 3),
                    spacing: 10
                ) {
                    ForEach(numbers, id: \.self) { number in
                        Button {
                            appState.numberOfPlayers = number
                        } label: {
                            Text(tf("player_count_format", number))
                                .font(.system(size: 18, weight: .bold))
                                .foregroundStyle(appState.numberOfPlayers == number ? .white : .primary)
                                .frame(width: cellWidth, height: cellWidth / 1.5)
                                .background(appState.numberOfPlayers == number ? Color(red: 0.13, green: 0.59, blue: 0.95) : Color(.secondarySystemBackground))
                                .clipShape(RoundedRectangle(cornerRadius: 10))
                        }
                        .buttonStyle(.plain)
                    }
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
                .padding(.horizontal, 10)
            }

            DecisionButton(title: t("decision.confirm")) {
                if let errorKey = appState.validatePlayerCount() {
                    validationMessage = validationText(errorKey)
                    return
                }
                appState.resetPlayerNames()
                onNext()
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 24)
        }
        .background(Color(.systemBackground))
        .navigationTitle(t("member_number.title"))
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
    }
}
