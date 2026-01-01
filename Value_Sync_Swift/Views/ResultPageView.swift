import SwiftUI

// Results screen that reveals answers sequentially.
struct ResultPageView: View {
    @EnvironmentObject private var appState: AppState
    @State private var checkedIndices: Set<Int> = []
    @State private var showResultSummary = false
    @State private var animationID = UUID()
    @State private var lastRevealedIndex: Int?
    @State private var validationMessage: String?
    private let revealInterval: TimeInterval = 0.6
    let onRestartSameMembers: () -> Void
    let onGoHome: () -> Void

    // Localized string helper.
    private func t(_ key: String) -> String {
        Localizer.string(key, language: appState.language)
    }

    // Localized formatted string helper.
    private func tf(_ key: String, _ args: CVarArg...) -> String {
        Localizer.format(key, language: appState.language, args)
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
        ScrollViewReader { proxy in
            ScrollView {
                ResultListView(
                    userAnswer: appState.userAnswer,
                    checkedIndices: checkedIndices,
                    noDataText: t("result_page.no_data"),
                    yourNumberText: { number in
                        tf("result_page.your_number_format", number)
                    },
                    isCorrect: { index in
                        isCorrectAnswer(index)
                    }
                )
                .padding(20)
            }
            .onChange(of: lastRevealedIndex) { _, newValue in
                guard let index = newValue else { return }
                withAnimation(.easeInOut(duration: 0.35)) {
                    proxy.scrollTo(index, anchor: .bottom)
                }
            }
        }
        .background(Color(.systemBackground))
        .navigationTitle(t("result_page.title"))
        .navigationBarTitleDisplayMode(.inline)
        .animation(.easeInOut(duration: 0.25), value: checkedIndices)
        .onAppear {
            if let errorKey = appState.validateResultsReady() {
                validationMessage = t(errorKey)
                return
            }
            startResultAnimation()
        }
        .safeAreaInset(edge: .bottom) {
            if showResultSummary {
                ResultSummaryView(
                    isAllCorrect: isAllCorrect(),
                    onRestartSameMembers: onRestartSameMembers,
                    onGoHome: onGoHome
                )
                .transition(.move(edge: .bottom).combined(with: .opacity))
            }
        }
        .alert(t("validation.title"), isPresented: isValidationPresented) {
            Button(t("common.ok"), role: .cancel) {
                validationMessage = nil
            }
        } message: {
            Text(validationMessage ?? "")
        }
    }

    // Animates the sequential reveal and shows the summary card.
    private func startResultAnimation() {
        guard !appState.userAnswer.isEmpty else { return }
        checkedIndices = []
        showResultSummary = false
        animationID = UUID()
        let currentID = animationID
        let lastIndex = appState.userAnswer.count - 1
        for index in appState.userAnswer.indices {
            let delay = Double(index) * revealInterval
            DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
                guard currentID == animationID else { return }
                withAnimation(.easeInOut(duration: 0.25)) {
                    _ = checkedIndices.insert(index)
                }
                lastRevealedIndex = index
            }
        }
        let summaryDelay = (Double(lastIndex) * revealInterval) + 0.45
        DispatchQueue.main.asyncAfter(deadline: .now() + summaryDelay) {
            guard currentID == animationID else { return }
            withAnimation(.easeInOut(duration: 0.3)) {
                showResultSummary = true
            }
        }
    }

    // Checks whether a specific answer is correct.
    private func isCorrectAnswer(_ index: Int) -> Bool {
        guard appState.userAnswer.indices.contains(index),
              appState.correctOrder.indices.contains(index) else {
            return false
        }
        return appState.userAnswer[index].number == appState.correctOrder[index].number
    }

    // Checks whether all answers are correct.
    private func isAllCorrect() -> Bool {
        guard !appState.userAnswer.isEmpty, appState.userAnswer.count == appState.correctOrder.count else {
            return false
        }
        return appState.userAnswer.indices.allSatisfy { isCorrectAnswer($0) }
    }
}

struct ResultListView: View {
    let userAnswer: [PlayerData]
    let checkedIndices: Set<Int>
    let noDataText: String
    let yourNumberText: (Int) -> String
    let isCorrect: (Int) -> Bool

    var body: some View {
        VStack(spacing: 12) {
            if userAnswer.isEmpty {
                Text(noDataText)
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundStyle(.secondary)
                    .padding(.top, 24)
            } else {
                ForEach(userAnswer.indices, id: \.self) { index in
                    ResultRowView(
                        index: index,
                        player: userAnswer[index],
                        isChecked: checkedIndices.contains(index),
                        isCorrect: isCorrect(index),
                        yourNumberText: yourNumberText
                    )
                    .id(index)
                }
            }
        }
    }
}

struct ResultRowView: View {
    let index: Int
    let player: PlayerData
    let isChecked: Bool
    let isCorrect: Bool
    let yourNumberText: (Int) -> String

    var body: some View {
        HStack(spacing: 12) {
            Text("\(index + 1)")
                .font(.system(size: 14, weight: .bold))
                .foregroundStyle(.white)
                .frame(width: 26, height: 26)
                .background(Color(red: 0.13, green: 0.59, blue: 0.95))
                .clipShape(Circle())
            VStack(alignment: .leading, spacing: 4) {
                Text(player.name)
                    .font(.system(size: 18, weight: .semibold))
                Text(yourNumberText(player.number))
                    .font(.system(size: 14))
                    .foregroundStyle(.secondary)
                    .opacity(isChecked ? 1 : 0)
            }
            Spacer()
            if isChecked {
                Image(systemName: isCorrect ? "checkmark.circle.fill" : "xmark.circle.fill")
                    .font(.system(size: 22))
                    .foregroundStyle(isCorrect ? Color(red: 0.30, green: 0.69, blue: 0.31) : Color.red)
                    .transition(.scale.combined(with: .opacity))
            }
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(isChecked ? (isCorrect ? Color.green.opacity(0.18) : Color.red.opacity(0.18)) : Color(.secondarySystemBackground))
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .stroke(isChecked ? (isCorrect ? Color.green : Color.red) : Color(.separator), lineWidth: 1)
        )
        .clipShape(RoundedRectangle(cornerRadius: 10))
    }
}

// Summary card shown at the bottom after reveal completes.
struct ResultSummaryView: View {
    @EnvironmentObject private var appState: AppState
    let isAllCorrect: Bool
    let onRestartSameMembers: () -> Void
    let onGoHome: () -> Void

    // Localized string helper.
    private func t(_ key: String) -> String {
        Localizer.string(key, language: appState.language)
    }

    private func tf(_ key: String, _ args: CVarArg...) -> String {
        Localizer.format(key, language: appState.language, args)
    }

    private var matchRate: Double {
        guard !appState.userAnswer.isEmpty, appState.userAnswer.count == appState.correctOrder.count else {
            return 0
        }
        let matches = appState.userAnswer.indices.filter { index in
            appState.userAnswer[index].number == appState.correctOrder[index].number
        }.count
        return Double(matches) / Double(appState.userAnswer.count)
    }

    private var matchPercentText: String {
        let percent = Int(round(matchRate * 100))
        return tf("result_summary.match_rate_format", percent)
    }

    private var rating: Int {
        let percent = matchRate * 100
        switch percent {
        case 100:
            return 5
        case 80...:
            return 4
        case 60...:
            return 3
        case 40...:
            return 2
        case 20...:
            return 1
        default:
            return 0
        }
    }

    private var titleKey: String {
        let percent = matchRate * 100
        switch percent {
        case 100:
            return "result_summary.title_perfect"
        case 70...:
            return "result_summary.title_close"
        case 40...:
            return "result_summary.title_gap"
        default:
            return "result_summary.title_wide"
        }
    }

    var body: some View {
        VStack(spacing: 16) {
            Text(t(titleKey))
                .font(.system(size: 24, weight: .bold))
                .foregroundStyle(Color(red: 0.13, green: 0.59, blue: 0.95))
            Text(matchPercentText)
                .font(.system(size: 20, weight: .semibold))

            ResultProgressBar(progress: matchRate)

            HStack(spacing: 4) {
                ForEach(0..<5, id: \.self) { index in
                    Image(systemName: index < rating ? "star.fill" : "star")
                        .foregroundStyle(index < rating ? Color.yellow : Color.gray)
                }
            }

            Text(isAllCorrect ? t("result_summary.all_message") : t("result_summary.not_message"))
                .font(.system(size: 16))
                .multilineTextAlignment(.center)

            HStack(spacing: 12) {
                Button(t("result_summary.restart_same")) {
                    onRestartSameMembers()
                }
                .buttonStyle(.borderedProminent)
                Button(t("result_summary.home")) {
                    onGoHome()
                }
                .buttonStyle(.bordered)
            }
        }
        .padding(20)
        .frame(maxWidth: .infinity)
        .background(Color(.systemBackground))
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color(.separator), lineWidth: 1)
        )
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
    }
}

struct ResultProgressBar: View {
    let progress: Double
    @State private var animatedProgress: Double = 0

    var body: some View {
        GeometryReader { proxy in
            ZStack(alignment: .leading) {
                Capsule()
                    .fill(Color(.secondarySystemBackground))
                Capsule()
                    .fill(Color(red: 0.13, green: 0.59, blue: 0.95))
                    .frame(width: proxy.size.width * CGFloat(animatedProgress))
            }
        }
        .frame(height: 10)
        .onAppear {
            withAnimation(.easeInOut(duration: 0.6)) {
                animatedProgress = min(max(progress, 0), 1)
            }
        }
    }
}
