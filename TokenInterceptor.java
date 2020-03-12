package com.example.study.config;

import com.example.study.publicFile.TokenUntil;
import org.json.JSONObject;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;

@Component
public class TokenInterceptor implements HandlerInterceptor {


    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String url = request.getRequestURI();
        System.out.print("19行："+url);
        if (request.getMethod().equals("OPTIONS")) {
            response.setStatus(HttpServletResponse.SC_OK);
            return true;
        }

        response.setCharacterEncoding("utf-8");

        String token = request.getHeader("admin-token");
        if (token != null) {
            boolean result = TokenUntil.verify(token);
            if (result) {
                System.out.println("通过拦截器");
                return true;
            }
        }
//        response.setCharacterEncoding("UTF-8");
//        response.setContentType("application/json; charset=utf-8");
//        PrintWriter out = null;
//        try {
//            JSONObject json = new JSONObject();
//            json.put("success", "false");
//            json.put("msg", "41行:认证失败，未通过拦截器");
//            json.put("code", "50000");
//            System.out.println("43行:认证失败，未通过拦截器");
//            //        response.getWriter().write("50000");
//        } catch (Exception e) {
//            e.printStackTrace();
//            response.sendError(500);
//            return false;
//        }
        return  false;

    }


}
