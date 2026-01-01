import SwiftUI

// In-app manual explaining gameplay.
struct ManualView: View {
    @EnvironmentObject private var appState: AppState

    // Localized string helper.
    private func t(_ key: String) -> String {
        Localizer.string(key, language: appState.language)
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    SectionCard(
                        title: t("manual.overview_title"),
                        titleColor: Color(red: 0.10, green: 0.46, blue: 0.82),
                        backgroundColor: Color(.secondarySystemBackground)
                    ) {
                        Text(t("manual.overview_content"))
                    }

                    ManualSection(title: t("manual.section1_title"), content: t("manual.section1_content"))
                    ManualSection(title: t("manual.section2_title"), content: t("manual.section2_content"))
                    ManualSection(title: t("manual.section3_title"), content: t("manual.section3_content"))
                    ManualSection(title: t("manual.section4_title"), content: t("manual.section4_content"))
                    ManualSection(title: t("manual.section5_title"), content: t("manual.section5_content"))
                    ManualSection(title: t("manual.section6_title"), content: t("manual.section6_content"))
                    ManualSection(title: t("manual.section7_title"), content: t("manual.section7_content"))

                    SectionCard(
                        title: t("manual.tips_title"),
                        titleColor: Color(red: 0.10, green: 0.46, blue: 0.82),
                        backgroundColor: Color(.secondarySystemBackground)
                    ) {
                        Text(t("manual.tips_content"))
                    }

                    SectionCard(
                        title: t("manual.example_title"),
                        titleColor: Color(red: 0.90, green: 0.32, blue: 0.0),
                        backgroundColor: Color(.secondarySystemBackground)
                    ) {
                        VStack(alignment: .leading, spacing: 8) {
                            Text(t("manual.example_theme"))
                                .font(.system(size: 16, weight: .bold))
                            Text(t("manual.example_text"))
                                .font(.system(size: 14))
                            Text(t("manual.example_description"))
                                .font(.system(size: 14))
                                .foregroundStyle(Color.gray)
                        }
                    }
                }
                .padding(20)
            }
            .navigationTitle(t("manual.title"))
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}
