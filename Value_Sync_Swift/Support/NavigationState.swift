import SwiftUI

// Shared navigation path for programmatic routing.
final class NavigationState: ObservableObject {
    @Published var path = NavigationPath()
}
