import SwiftUI

// Theme selection screen with random, category, and custom options.
struct ThemeSelectView: View {
    @EnvironmentObject private var appState: AppState
    @State private var isManualPresented = false
    @State private var selectedCategory: ThemeCategory?
    @State private var currentTheme: ThemeItem?
    @State private var customThemeText = ""
    @State private var customMetricText = ""
    @State private var lastLanguage: AppLanguage = .japanese
    @State private var activeAlert: ThemeSelectAlert?
    let hideBackButton: Bool
    let onConfirm: (ThemeItem) -> Void

    // Localized string helper.
    private func t(_ key: String) -> String {
        Localizer.string(key, language: appState.language)
    }

    // Returns the localized default metric text.
    private func defaultMetricText() -> String {
        t("theme_select.default_metric")
    }

    private func sectionFontSize() -> CGFloat {
        appState.language == .english ? 20 : 22
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 12) {
                Text(t("theme_select.random_section"))
                    .font(.system(size: sectionFontSize(), weight: .bold))

                DecisionButton(title: t("theme_select.random_button")) {
                    currentTheme = ThemeLibrary.allThemes(for: appState.language).randomElement()
                    if let theme = currentTheme {
                        activeAlert = .confirm(theme: theme)
                    }
                }

                Text(t("theme_select.category_section"))
                    .font(.system(size: sectionFontSize(), weight: .bold))
                    .padding(.top, 4)

                LazyVGrid(
                    columns: Array(repeating: GridItem(.flexible(), spacing: 8), count: 2),
                    spacing: 8
                ) {
                    ForEach(ThemeLibrary.categories) { category in
                        Button {
                            selectedCategory = category
                        } label: {
                            ThemeCategoryCard(category: category)
                        }
                        .buttonStyle(.plain)
                    }
                }

                Text(t("theme_select.custom_section"))
                    .font(.system(size: sectionFontSize(), weight: .bold))
                    .padding(.top, 6)

                VStack(spacing: 10) {
                    TextField(t("theme_select.custom_theme_placeholder"), text: $customThemeText)
                        .textFieldStyle(.roundedBorder)
                    TextField(t("theme_select.custom_metric_placeholder"), text: $customMetricText)
                        .textFieldStyle(.roundedBorder)
                    DecisionButton(title: t("theme_select.custom_confirm")) {
                        let trimmed = customThemeText.trimmingCharacters(in: .whitespacesAndNewlines)
                        guard !trimmed.isEmpty else {
                            activeAlert = .validation(message: t("validation.theme_missing"))
                            return
                        }
                        let metric = customMetricText.trimmingCharacters(in: .whitespacesAndNewlines)
                        currentTheme = ThemeItem(
                            id: UUID().uuidString,
                            theme: trimmed,
                            metric: metric.isEmpty ? defaultMetricText() : metric,
                            categoryId: "custom"
                        )
                        if let theme = currentTheme {
                            activeAlert = .confirm(theme: theme)
                        }
                    }
                }
            }
            .padding(18)
        }
        .background(Color(.systemBackground))
        .navigationTitle(t("theme_select.title"))
        .navigationBarTitleDisplayMode(.inline)
        .navigationBarBackButtonHidden(hideBackButton)
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
        .sheet(item: $selectedCategory) { category in
            ThemeListView(
                category: category,
                onSelect: { theme in
                    currentTheme = theme
                    selectedCategory = nil
                    DispatchQueue.main.async {
                        activeAlert = .confirm(theme: theme)
                    }
                }
            )
        }
        .alert(item: $activeAlert) { alert in
            switch alert {
            case .confirm(let theme):
                return Alert(
                    title: Text(t("theme_select.confirm_title")),
                    message: Text("\(theme.theme)\n\(theme.metric)"),
                    primaryButton: .default(Text(t("decision.confirm"))) {
                        onConfirm(theme)
                    },
                    secondaryButton: .cancel(Text(t("common.cancel")))
                )
            case .validation(let message):
                return Alert(
                    title: Text(t("validation.title")),
                    message: Text(message),
                    dismissButton: .cancel(Text(t("common.ok")))
                )
            }
        }
        .onAppear {
            if customMetricText.isEmpty {
                customMetricText = defaultMetricText()
            }
            lastLanguage = appState.language
        }
        .onChange(of: appState.language) { _, newValue in
            let previousDefault = Localizer.string("theme_select.default_metric", language: lastLanguage)
            if customMetricText == previousDefault || customMetricText.isEmpty {
                customMetricText = Localizer.string("theme_select.default_metric", language: newValue)
            }
            lastLanguage = newValue
        }
    }
}

enum ThemeSelectAlert: Identifiable {
    case confirm(theme: ThemeItem)
    case validation(message: String)

    var id: String {
        switch self {
        case .confirm(let theme):
            return "confirm-\(theme.id)"
        case .validation(let message):
            return "validation-\(message)"
        }
    }
}

// Category card used in the theme grid.
struct ThemeCategoryCard: View {
    @EnvironmentObject private var appState: AppState
    let category: ThemeCategory

    // Localized string helper.
    private func t(_ key: String) -> String {
        Localizer.string(key, language: appState.language)
    }

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: category.icon)
                .font(.system(size: 20, weight: .semibold))
                .foregroundStyle(.white)
                .frame(width: 36, height: 36)
                .background(category.color.opacity(0.9))
                .clipShape(Circle())
            Text(t(category.nameKey))
                .font(.system(size: 16, weight: .semibold))
                .foregroundStyle(.primary)
            Spacer()
        }
        .padding(10)
        .background(Color(.secondarySystemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}

// Modal list of themes for a selected category.
struct ThemeListView: View {
    @EnvironmentObject private var appState: AppState
    let category: ThemeCategory?
    let onSelect: (ThemeItem) -> Void

    // Localized string helper.
    private func t(_ key: String) -> String {
        Localizer.string(key, language: appState.language)
    }

    var body: some View {
        NavigationStack {
            List(themesForCategory) { theme in
                Button {
                    onSelect(theme)
                } label: {
                    VStack(alignment: .leading, spacing: 6) {
                        Text(theme.theme)
                            .font(.system(size: 16, weight: .semibold))
                        Text(theme.metric)
                            .font(.system(size: 13))
                            .foregroundStyle(.secondary)
                    }
                    .padding(.vertical, 6)
                }
                .buttonStyle(.plain)
            }
            .navigationTitle(category.map { t($0.nameKey) } ?? t("theme_list.title_default"))
            .navigationBarTitleDisplayMode(.inline)
        }
    }

    // Filters theme list by current category and language.
    private var themesForCategory: [ThemeItem] {
        guard let category else { return [] }
        return ThemeLibrary.allThemes(for: appState.language).filter { $0.categoryId == category.id }
    }
}
