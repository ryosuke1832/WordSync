import SwiftUI

// Root navigation shell that wires all screens and shared state.
struct ContentView: View {
    @StateObject private var navigationState = NavigationState()
    @StateObject private var appState = AppState()

    var body: some View {
        NavigationStack(path: $navigationState.path) {
            TopPageView {
                navigationState.path.append(AppRoute.memberNumberSetting)
            }
            .navigationDestination(for: AppRoute.self) { route in
                switch route {
                case .memberNumberSetting:
                    MemberNumberSettingView {
                        navigationState.path.append(AppRoute.memberNameSetting)
                    }
                case .memberNameSetting:
                    MemberNameSettingView {
                        navigationState.path.append(AppRoute.themeSelect(hideBackButton: false))
                    }
                case let .themeSelect(hideBackButton):
                    ThemeSelectView(hideBackButton: hideBackButton) { theme in
                        appState.selectedTheme = theme
                        navigationState.path.append(AppRoute.confirmationNameNumber)
                    }
                case .confirmationNameNumber:
                    ConfirmationNameNumberView {
                        navigationState.path.append(AppRoute.discussion)
                    }
                case .discussion:
                    DiscussionView {
                        navigationState.path.append(AppRoute.resultInput)
                    }
                case .resultInput:
                    ResultInputView()
                case .resultPage:
                    ResultPageView(
                        onRestartSameMembers: {
                            appState.resetGameKeepPlayers()
                            navigationState.path = NavigationPath([AppRoute.themeSelect(hideBackButton: true)])
                        },
                        onGoHome: {
                            appState.resetGame()
                            navigationState.path = NavigationPath()
                        }
                    )
                }
            }
        }
        .environmentObject(appState)
        .environmentObject(navigationState)
    }
}

// Navigation routes used by the stack.
enum AppRoute: Hashable {
    case memberNumberSetting
    case memberNameSetting
    case themeSelect(hideBackButton: Bool)
    case confirmationNameNumber
    case discussion
    case resultInput
    case resultPage
}

#Preview {
    ContentView()
}
