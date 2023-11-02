package com.expocamera;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MyReactPackage implements ReactPackage {

    public MyRNModule myNativeModule;
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        myNativeModule = new MyRNModule(reactContext);
        List<NativeModule> modules = new ArrayList<>();
        //将我们创建NativeModule添加进原生模块列表中
        modules.add(myNativeModule);
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        //该处后期RN调用原生控件或自定义组件时可用到
        return Collections.emptyList();
    }
}
