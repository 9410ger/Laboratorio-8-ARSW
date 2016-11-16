/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.msgbroker;

import edu.eci.arsw.msgbroker.model.Point;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

/**
 *
 * @author ger9410
 */
@Controller
public class STOMPMessagesHandler {

    @Autowired
    SimpMessagingTemplate msgt;
    public static CopyOnWriteArrayList<Point> puntos= new CopyOnWriteArrayList<>();

    @MessageMapping("/newpoint")
    public void getLine(Point pt) throws Exception {
        System.out.println("Nuevo punto recibido en el servidor! :"+pt);
        msgt.convertAndSend("/topic/newpoint", pt);
    }
    
    @MessageMapping("/newpolygon")    
    public void getPoligono(Point pt) throws Exception {
        
        puntos.add(pt);
        System.out.println("Nueva punto recibido para el arreglo en el servidor!: "+Arrays.toString(puntos.toArray()));
        if(puntos.size()==4){
            msgt.convertAndSend("/topic/newpolygon", puntos);
            puntos.clear();
        }
    }
    
}
