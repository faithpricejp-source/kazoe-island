// かぞえ島 for Mac: a window with a WKWebView that plays the bundled web app (Resources/web) offline.
// Files are served through a custom "kazoe://" scheme so the page has a stable origin and its localStorage
// (the child's progress) persists between launches.
// `--selftest` loads the page, prints the stored value from the previous run plus a few facts, then quits.
import Cocoa
import WebKit

final class BundleScheme: NSObject, WKURLSchemeHandler {
    let root: URL
    init(root: URL) { self.root = root.standardizedFileURL }
    func webView(_ webView: WKWebView, start task: WKURLSchemeTask) {
        guard let url = task.request.url else { return }
        let rel = url.path.isEmpty || url.path == "/" ? "index.html" : String(url.path.dropFirst())
        let file = root.appendingPathComponent(rel).standardizedFileURL
        guard file.path.hasPrefix(root.path + "/"), let data = try? Data(contentsOf: file) else {
            task.didFailWithError(NSError(domain: NSURLErrorDomain, code: NSURLErrorFileDoesNotExist)); return
        }
        let types = ["html": "text/html; charset=utf-8", "js": "text/javascript; charset=utf-8", "png": "image/png",
                     "webmanifest": "application/manifest+json", "css": "text/css; charset=utf-8"]
        let mime = types[file.pathExtension] ?? "application/octet-stream"
        task.didReceive(HTTPURLResponse(url: url, statusCode: 200, httpVersion: "HTTP/1.1",
                                        headerFields: ["Content-Type": mime, "Content-Length": "\(data.count)"])!)
        task.didReceive(data)
        task.didFinish()
    }
    func webView(_ webView: WKWebView, stop task: WKURLSchemeTask) {}
}

final class AppDelegate: NSObject, NSApplicationDelegate, WKNavigationDelegate, WKUIDelegate, WKDownloadDelegate {
    var window: NSWindow!
    var web: WKWebView!
    let selftest = CommandLine.arguments.contains("--selftest")

    func applicationDidFinishLaunching(_ note: Notification) {
        buildMenu()
        let cfg = WKWebViewConfiguration()
        cfg.setURLSchemeHandler(BundleScheme(root: Bundle.main.resourceURL!.appendingPathComponent("web")), forURLScheme: "kazoe")
        cfg.websiteDataStore = .default()
        web = WKWebView(frame: .zero, configuration: cfg)
        web.navigationDelegate = self
        web.uiDelegate = self
        window = NSWindow(contentRect: NSRect(x: 0, y: 0, width: 1100, height: 820),
                          styleMask: [.titled, .closable, .miniaturizable, .resizable], backing: .buffered, defer: false)
        window.title = "かぞえ島"
        window.minSize = NSSize(width: 420, height: 560)
        window.contentView = web
        window.center()
        window.setFrameAutosaveName("KazoeMainWindow")
        window.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)
        web.load(URLRequest(url: URL(string: "kazoe://app/index.html")!))
    }

    func webView(_ w: WKWebView, didFinish navigation: WKNavigation!) {
        guard selftest else { return }
        let js = "(()=>{const before=localStorage.getItem('kazoe-selftest');localStorage.setItem('kazoe-selftest',String(Date.now()));" +
                 "return JSON.stringify({before,worlds:WORLDS.length,chapters:ALLCH.length,missingText:__i18nAudit().length,title:document.title})})()"
        w.evaluateJavaScript(js) { result, error in
            print("SELFTEST", result ?? "nil", error.map { "\($0)" } ?? "")
            fflush(stdout)
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) { NSApp.terminate(nil) } // let WebKit flush storage
        }
    }

    // links to other websites open in the default browser
    func webView(_ w: WKWebView, decidePolicyFor action: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        if action.shouldPerformDownload { decisionHandler(.download); return }   // "save as image" in the workshop
        if let u = action.request.url, u.scheme == "http" || u.scheme == "https", action.navigationType == .linkActivated {
            NSWorkspace.shared.open(u); decisionHandler(.cancel); return
        }
        decisionHandler(.allow)
    }
    func webView(_ w: WKWebView, createWebViewWith c: WKWebViewConfiguration, for action: WKNavigationAction, windowFeatures f: WKWindowFeatures) -> WKWebView? {
        if let u = action.request.url { NSWorkspace.shared.open(u) }
        return nil
    }
    // downloads (her drawings) go to ~/Downloads without asking; an existing name gets " 2", " 3", …
    func webView(_ w: WKWebView, navigationAction: WKNavigationAction, didBecome download: WKDownload) { download.delegate = self }
    func webView(_ w: WKWebView, navigationResponse: WKNavigationResponse, didBecome download: WKDownload) { download.delegate = self }
    func download(_ download: WKDownload, decideDestinationUsing response: URLResponse, suggestedFilename: String, completionHandler: @escaping (URL?) -> Void) {
        let dir = FileManager.default.urls(for: .downloadsDirectory, in: .userDomainMask)[0]
        let base = (suggestedFilename as NSString).deletingPathExtension, ext = (suggestedFilename as NSString).pathExtension
        var url = dir.appendingPathComponent(suggestedFilename), i = 2
        while FileManager.default.fileExists(atPath: url.path) { url = dir.appendingPathComponent("\(base) \(i).\(ext)"); i += 1 }
        completionHandler(url)
    }
    func downloadDidFinish(_ download: WKDownload) {
        web.evaluateJavaScript("typeof koboSavedDl==='function'&&koboSavedDl()", completionHandler: nil)
    }
    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool { true }

    @objc func reloadPage() { web.reload() }

    func buildMenu() {
        let main = NSMenu()
        let appItem = NSMenuItem(); main.addItem(appItem)
        let appMenu = NSMenu()
        appMenu.addItem(withTitle: "かぞえ島について", action: #selector(NSApplication.orderFrontStandardAboutPanel(_:)), keyEquivalent: "")
        appMenu.addItem(.separator())
        appMenu.addItem(withTitle: "かぞえ島を隠す", action: #selector(NSApplication.hide(_:)), keyEquivalent: "h")
        appMenu.addItem(withTitle: "かぞえ島を終了", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
        appItem.submenu = appMenu
        let editItem = NSMenuItem(); main.addItem(editItem)
        let edit = NSMenu(title: "編集")
        edit.addItem(withTitle: "取り消す", action: Selector(("undo:")), keyEquivalent: "z")
        edit.addItem(.separator())
        edit.addItem(withTitle: "カット", action: #selector(NSText.cut(_:)), keyEquivalent: "x")
        edit.addItem(withTitle: "コピー", action: #selector(NSText.copy(_:)), keyEquivalent: "c")
        edit.addItem(withTitle: "ペースト", action: #selector(NSText.paste(_:)), keyEquivalent: "v")
        edit.addItem(withTitle: "すべてを選択", action: #selector(NSText.selectAll(_:)), keyEquivalent: "a")
        editItem.submenu = edit
        let viewItem = NSMenuItem(); main.addItem(viewItem)
        let view = NSMenu(title: "表示")
        view.addItem(withTitle: "再読み込み", action: #selector(reloadPage), keyEquivalent: "r")
        view.addItem(withTitle: "フルスクリーン", action: #selector(NSWindow.toggleFullScreen(_:)), keyEquivalent: "f")
        viewItem.submenu = view
        NSApp.mainMenu = main
    }
}

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.setActivationPolicy(.regular)
app.run()
