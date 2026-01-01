import SwiftUI

// Circular start button used on the top page.
struct StartButton: View {
    let title: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 4) {
                Image(systemName: "play.fill")
                    .font(.system(size: 30, weight: .semibold))
                    .foregroundStyle(Color(red: 0.50, green: 0.50, blue: 0.84))
                Text(title)
                    .font(.system(size: 22, weight: .semibold))
                    .foregroundStyle(Color(red: 0.50, green: 0.50, blue: 0.84))
                    .tracking(1)
            }
            .frame(width: 170, height: 170)
            .background(Color.white)
            .clipShape(Circle())
            .shadow(color: Color.black.opacity(0.2), radius: 8, x: 0, y: 4)
        }
        .buttonStyle(.plain)
    }
}

// Full-width primary action button.
struct DecisionButton: View {
    let title: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.system(size: 18, weight: .bold))
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(Color(red: 0.13, green: 0.59, blue: 0.95))
                .foregroundStyle(.white)
                .clipShape(RoundedRectangle(cornerRadius: 12))
        }
        .buttonStyle(.plain)
    }
}

// Standard section row used in the manual view.
struct ManualSection: View {
    let title: String
    let content: String

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.system(size: 18, weight: .bold))
                .foregroundStyle(Color(red: 0.13, green: 0.59, blue: 0.95))
            Text(content)
                .font(.system(size: 16))
                .foregroundStyle(.secondary)
        }
    }
}

// Card container with a title and custom content.
struct SectionCard<Content: View>: View {
    let title: String
    let titleColor: Color
    let backgroundColor: Color
    @ViewBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(title)
                .font(.system(size: 20, weight: .bold))
                .foregroundStyle(titleColor)
            content
                .font(.system(size: 16))
                .foregroundStyle(.secondary)
        }
        .padding(16)
        .background(backgroundColor)
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}

// Timer adjust button for +/- minutes.
struct TimeAdjustButton: View {
    let title: String
    let systemImage: String
    let isDisabled: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 6) {
                Image(systemName: systemImage)
                    .font(.system(size: 36))
                Text(title)
                    .font(.system(size: 20, weight: .bold))
            }
            .foregroundStyle(isDisabled ? Color.gray : Color(red: 0.13, green: 0.59, blue: 0.95))
            .frame(width: 80)
        }
        .buttonStyle(.plain)
        .disabled(isDisabled)
        .opacity(isDisabled ? 0.5 : 1)
    }
}

// Circular icon button used for timer controls.
struct CircleIconButton: View {
    let systemImage: String
    var filled: Bool = false
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Image(systemName: systemImage)
                .font(.system(size: filled ? 36 : 30, weight: .bold))
                .foregroundStyle(filled ? Color.white : Color(red: 0.13, green: 0.59, blue: 0.95))
                .frame(width: filled ? 90 : 70, height: filled ? 90 : 70)
                .background(filled ? Color(red: 0.13, green: 0.59, blue: 0.95) : Color.clear)
                .overlay(
                    Circle()
                        .stroke(Color(red: 0.13, green: 0.59, blue: 0.95), lineWidth: filled ? 0 : 3)
                )
                .clipShape(Circle())
        }
        .buttonStyle(.plain)
    }
}
