import React, { useState } from 'react';
import { X, Smartphone, Copy, Check, Code, Terminal, Layers } from 'lucide-react';

interface AndroidExporterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidExporterModal: React.FC<AndroidExporterModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const codeSnippets = [
    {
      title: 'MainActivity.kt (WebView Container)',
      language: 'kotlin',
      code: `package com.wingo.aipredictor

import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        webView = WebView(this)
        setContentView(webView)

        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.webViewClient = WebViewClient()

        // Replace with your hosted AI Studio applet URL
        webView.loadUrl("https://your-wingo-app.run.app")
    }
}`,
    },
    {
      title: 'AndroidManifest.xml (Internet Permission)',
      language: 'xml',
      code: `<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.wingo.aipredictor">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Wingo AI Bot"
        android:theme="@style/Theme.AppCompat.NoActionBar">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,
    },
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-4">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Android Studio Export Code</h2>
            <p className="text-xs text-slate-400">Convert this web app into a Android APK app easily</p>
          </div>
        </div>

        <div className="space-y-4">
          {codeSnippets.map((snippet, idx) => (
            <div key={idx} className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Code className="w-4 h-4 text-cyan-400" />
                  {snippet.title}
                </span>
                <button
                  onClick={() => handleCopy(snippet.code, idx)}
                  className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-emerald-400 transition"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Code
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-[11px] font-mono text-emerald-300/90 overflow-x-auto">
                {snippet.code}
              </pre>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs hover:bg-slate-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
