package com.project.dashboard.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

// 1. @WebServlet defines the URL pattern for this specific servlet
@WebServlet(name = "HelloServlet", urlPatterns = "/simple-servlet")
public class HelloServlet extends HttpServlet {

    // 2. Override doGet to handle GET requests (like typing URL in browser)
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        
        // Set response content type
        resp.setContentType("text/html");
        
        // Write the response logic
        PrintWriter out = resp.getWriter();
        out.println("<html><body>");
        out.println("<h1>Servlet Implementation Successful!</h1>");
        out.println("<p>This response is generated directly by a raw Java Servlet, bypassing Spring MVC controllers.</p>");
        out.println("<p>Server Time: " + new java.util.Date() + "</p>");
        out.println("</body></html>");
    }
}