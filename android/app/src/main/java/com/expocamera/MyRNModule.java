package com.expocamera;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.io.IOException;

public class MyRNModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext mContext;

    public MyRNModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "MyNativeModule";
    }

    //后面该方法可以用Linking代替
    @ReactMethod
    public void getFilePath(String fileName, Callback success) {
        try {
            String path = getLogPath(fileName);
            success.invoke(path);
        } catch (Exception ex) {
//            error.invoke(ex.getMessage());
            success.invoke("");
        }
    }

    public String getLogPath(String fileName) throws IOException {
        String filePath = mContext.getFilesDir().getAbsolutePath() + File.separator + "logs";
        File log = new File(filePath);
        if (!log.exists()) {
            log.mkdir();
        }
        return log.getAbsolutePath() + File.separator + fileName;
    }
}
