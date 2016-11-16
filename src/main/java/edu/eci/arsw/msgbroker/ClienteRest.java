/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.msgbroker;

import static edu.eci.arsw.msgbroker.STOMPMessagesHandler.puntos;
import edu.eci.arsw.msgbroker.model.Point;
import java.util.concurrent.CopyOnWriteArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author 2105403
 */
@RestController
@RequestMapping(value = "/puntos")
public class ClienteRest {
    @Autowired
    SimpMessagingTemplate msgt;
     @RequestMapping(method = RequestMethod.POST)    
    public ResponseEntity<?> enviarPunto(@RequestBody Point pt){
        msgt.convertAndSend("/topic/newpoint", pt);
        puntos.add(pt);
        if(puntos.size()==4){
            msgt.convertAndSend("/topic/newpolygon",puntos);
            puntos.clear();
        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
    
}
