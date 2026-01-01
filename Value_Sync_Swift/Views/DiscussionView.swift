import SwiftUI

// Discussion screen with timer controls.
struct DiscussionView: View {
    @EnvironmentObject private var appState: AppState
    @State private var isManualPresented = false
    @State private var timeLeft = 180
    @State private var isRunning = false
    @State private var timer: Timer?
    @State private var activeAlert: DiscussionAlert?
    let onNext: () -> Void

    // Localized string helper.
    private func t(_ key: String) -> String {
        Localizer.string(key, language: appState.language)
    }

    // Localized formatted string helper.
    private func tf(_ key: String, _ args: CVarArg...) -> String {
        Localizer.format(key, language: appState.language, args)
    }

    private var minutesText: String {
        String(format: "%02d", timeLeft / 60)
    }

    private var secondsText: String {
        String(format: "%02d", timeLeft % 60)
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

                VStack(spacing: 20) {
                    HStack(spacing: 10) {
                        Text(minutesText)
                        Text(":")
                        Text(secondsText)
                    }
                    .font(.system(size: 64, weight: .bold))
                    .foregroundStyle(Color(red: 0.13, green: 0.59, blue: 0.95))
                    .padding(.vertical, 16)
                    .frame(maxWidth: .infinity)
                    .background(Color(.secondarySystemBackground))
                    .overlay(
                        RoundedRectangle(cornerRadius: 24)
                            .stroke(Color(red: 0.13, green: 0.59, blue: 0.95).opacity(0.7), lineWidth: 3)
                    )

                    HStack(spacing: 24) {
                        TimeAdjustButton(
                            title: tf("timer.minus_format", 1),
                            systemImage: "minus.circle.fill",
                            isDisabled: isRunning
                        ) {
                            adjustTime(by: -1)
                        }

                        HStack(spacing: 16) {
                            CircleIconButton(systemImage: "arrow.clockwise") {
                                resetTimer()
                            }
                            CircleIconButton(
                                systemImage: isRunning ? "pause.fill" : "play.fill",
                                filled: true
                            ) {
                                isRunning ? stopTimer() : startTimer()
                            }
                        }

                        TimeAdjustButton(
                            title: tf("timer.plus_format", 1),
                            systemImage: "plus.circle.fill",
                            isDisabled: isRunning
                        ) {
                            adjustTime(by: 1)
                        }
                    }
                }

                DecisionButton(title: t("discussion.result_input")) {
                    if let errorKey = appState.validateThemeSelected() {
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
        .navigationTitle(t("discussion.title"))
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
            case .end:
                return Alert(
                    title: Text(t("discussion.end_title")),
                    message: Text(t("discussion.end_message")),
                    dismissButton: .default(Text(t("discussion.result_input"))) {
                        if let errorKey = appState.validateThemeSelected() {
                            activeAlert = .validation(t(errorKey))
                            return
                        }
                        onNext()
                    }
                )
            case .validation(let message):
                return Alert(
                    title: Text(t("validation.title")),
                    message: Text(message),
                    dismissButton: .cancel(Text(t("common.ok")))
                )
            }
        }
        .onDisappear {
            timer?.invalidate()
            timer = nil
            isRunning = false
        }
    }

    // Starts the countdown timer.
    private func startTimer() {
        guard !isRunning, timeLeft > 0 else { return }
        isRunning = true
        timer?.invalidate()
        timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { _ in
            if timeLeft <= 1 {
                timeLeft = 0
                isRunning = false
                timer?.invalidate()
                timer = nil
                activeAlert = .end
            } else {
                timeLeft -= 1
            }
        }
    }

    // Pauses the countdown timer.
    private func stopTimer() {
        guard isRunning else { return }
        isRunning = false
        timer?.invalidate()
        timer = nil
    }

    // Resets the timer to the initial value.
    private func resetTimer() {
        timer?.invalidate()
        timer = nil
        isRunning = false
        timeLeft = 180
    }

    // Adjusts time by minute increments while paused.
    private func adjustTime(by minutes: Int) {
        guard !isRunning else { return }
        let newTime = timeLeft + (minutes * 60)
        timeLeft = min(max(newTime, 0), 59 * 60)
    }
}

enum DiscussionAlert: Identifiable {
    case end
    case validation(String)

    var id: String {
        switch self {
        case .end:
            return "end"
        case .validation(let message):
            return "validation-\(message)"
        }
    }
}
