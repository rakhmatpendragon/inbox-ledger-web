package com.api.inbox.ledger.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class MainController {
  @GetMapping("/")
  public String home() {
      return "Hello, welcome to the API Inbox Ledger!";
  }
  
}
