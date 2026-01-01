import SwiftUI

// Landing screen with language toggle and manual access.
struct TopPageView: View {
    @EnvironmentObject private var appState: AppState
    let onStart: () -> Void
    @State private var isManualPresented = false
    @State private var isAnimating = false
    private var isEnglish: Bool { appState.language == .english }

    // Localized string helper.
    private func t(_ key: String) -> String {
        Localizer.string(key, language: appState.language)
    }

    var body: some View {
        ZStack {
            LinearGradient(
                colors: [
                    Color(red: 0.50, green: 0.50, blue: 0.84),
                    Color(red: 0.53, green: 0.66, blue: 0.91),
                    Color(red: 0.57, green: 0.92, blue: 0.89)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()

            VStack {
                HStack {
                    Spacer()
                    Button {
                        appState.language = isEnglish ? .japanese : .english
                    } label: {
                        Text(isEnglish ? "JA" : "EN")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundStyle(.white)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 6)
                            .background(Color.white.opacity(0.2))
                            .clipShape(Capsule())
                    }
                    .accessibilityLabel(isEnglish ? t("accessibility.switch_to_japanese") : t("accessibility.switch_to_english"))
                    Button {
                        isManualPresented = true
                    } label: {
                        Image(systemName: "questionmark.circle")
                            .font(.system(size: 28, weight: .regular))
                            .foregroundStyle(.white)
                            .padding(8)
                    }
                    .accessibilityLabel(t("accessibility.manual"))
                }
                .padding(.horizontal, 20)
                .padding(.top, 12)

                Spacer(minLength: 20)

                VStack(spacing: 24) {
                    ZStack {
                        Circle()
                            .fill(
                                AngularGradient(
                                    colors: [
                                        Color(red: 0.99, green: 0.83, blue: 0.52),
                                        Color(red: 0.98, green: 0.57, blue: 0.75),
                                        Color(red: 0.49, green: 0.77, blue: 1.0),
                                        Color(red: 0.57, green: 0.92, blue: 0.89),
                                        Color(red: 0.99, green: 0.83, blue: 0.52)
                                    ],
                                    center: .center
                                )
                            )
                            .frame(width: 210, height: 210)
                            .rotationEffect(.degrees(isAnimating ? 360 : 0))
                            .blur(radius: 7)
                            .opacity(0.85)

                        Circle()
                            .fill(Color.white.opacity(0.12))
                            .frame(width: 190, height: 190)

                        Circle()
                            .fill(Color(red: 0.99, green: 0.83, blue: 0.52).opacity(0.95))
                            .frame(width: 122, height: 122)
                            .offset(x: isAnimating ? -22 : -38, y: -10)
                            .blendMode(.screen)
                            .shadow(color: Color(red: 0.99, green: 0.83, blue: 0.52).opacity(0.5), radius: 12, x: 0, y: 6)

                        Circle()
                            .fill(Color(red: 0.49, green: 0.77, blue: 1.0).opacity(0.95))
                            .frame(width: 122, height: 122)
                            .offset(x: isAnimating ? 22 : 38, y: 12)
                            .blendMode(.screen)
                            .shadow(color: Color(red: 0.49, green: 0.77, blue: 1.0).opacity(0.5), radius: 12, x: 0, y: 6)

                        Circle()
                            .fill(
                                LinearGradient(
                                    colors: [
                                        Color.white.opacity(0.95),
                                        Color(red: 0.98, green: 0.57, blue: 0.75)
                                    ],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                            .frame(width: 68, height: 68)
                            .offset(x: 0, y: isAnimating ? -6 : 6)
                            .shadow(color: Color.white.opacity(0.7), radius: 9, x: 0, y: 0)

                        Circle()
                            .stroke(Color.white.opacity(0.9), lineWidth: 2)
                            .frame(width: 168, height: 168)
                            .scaleEffect(isAnimating ? 1.08 : 0.96)
                            .opacity(isAnimating ? 0.18 : 0.7)

                        Circle()
                            .fill(Color.white.opacity(0.9))
                            .frame(width: 12, height: 12)
                            .offset(x: 62, y: isAnimating ? -46 : -30)
                            .shadow(color: Color.white.opacity(0.8), radius: 8, x: 0, y: 0)

                        Circle()
                            .fill(Color.white.opacity(0.8))
                            .frame(width: 9, height: 9)
                            .offset(x: -60, y: isAnimating ? 40 : 26)

                        Circle()
                            .fill(Color.white.opacity(0.7))
                            .frame(width: 6, height: 6)
                            .offset(x: 0, y: isAnimating ? 54 : 42)
                    }

                    VStack(spacing: 10) {
                        Text("WordSync!")
                            .font(.system(size: 44, weight: .bold))
                            .foregroundStyle(.white)
                            .shadow(color: Color.black.opacity(0.2), radius: 4, x: 0, y: 2)
                            .tracking(2)
                        Text(t("top.subtitle"))
                            .font(.system(size: 17, weight: .semibold))
                            .foregroundStyle(Color.white.opacity(0.9))
                            .tracking(1)
                    }
                }

                Spacer()

                VStack(spacing: 12) {
                    StartButton(title: t("start_button.play"), action: onStart)
                    Text(t("top.start_hint"))
                        .font(.system(size: 14))
                        .foregroundStyle(Color.white.opacity(0.8))
                }
                .padding(.bottom, 40)
            }
        }
        .sheet(isPresented: $isManualPresented) {
            ManualView()
        }
        .toolbar(.hidden, for: .navigationBar)
        .onAppear {
            withAnimation(.easeInOut(duration: 3).repeatForever(autoreverses: true)) {
                isAnimating = true
            }
        }
    }
}
