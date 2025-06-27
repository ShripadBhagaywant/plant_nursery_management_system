package com.project.plant_nursery_management_system.exception;

public class BlockedUserException extends RuntimeException{

    public BlockedUserException(String msg) {
        super(msg);
    }
}
