package com.billguard.app;

import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Toast;

import androidx.activity.OnBackPressedCallback;
import androidx.core.splashscreen.SplashScreen;
import androidx.core.view.WindowCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private boolean doubleBackToExitPressedOnce = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // 1. Enable modern Splash Screen
        SplashScreen.installSplashScreen(this);
        
        super.onCreate(savedInstanceState);

        // 2. Smoothing UI/UX: Enable Edge-to-Edge display
        Window window = getWindow();
        WindowCompat.setDecorFitsSystemWindows(window, false);
        window.setStatusBarColor(Color.TRANSPARENT);
        window.setNavigationBarColor(Color.TRANSPARENT);
        
        // Ensure content doesn't jump when keyboard appears
        window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);

        // 3. Smart Back Button Handling
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                // Check if webview can go back (standard navigation)
                if (bridge != null && bridge.getWebView() != null) {
                    
                    // Signal the web app that back was pressed (this helps close sidebars/modals)
                    bridge.getWebView().evaluateJavascript(
                        "window.dispatchEvent(new CustomEvent('ionBackButton', { detail: { register: (p, f) => f() } }));" +
                        "window.dispatchEvent(new Event('backbutton'));", 
                        null
                    );

                    if (bridge.getWebView().canGoBack()) {
                        bridge.getWebView().goBack();
                        return;
                    }
                }

                // If at the start of history, handle exit/minimize with user-friendly reminder
                if (doubleBackToExitPressedOnce) {
                    moveTaskToBack(true);
                    return;
                }

                doubleBackToExitPressedOnce = true;
                Toast.makeText(MainActivity.this, "Press back again to exit", Toast.LENGTH_SHORT).show();

                new Handler(Looper.getMainLooper()).postDelayed(() -> doubleBackToExitPressedOnce = false, 2000);
            }
        });
    }
}
