package com.project.plant_nursery_management_system.exception;

public class UnauthorizedAccessException extends RuntimeException{

    public UnauthorizedAccessException(String msg)
    {
        super(msg);
    }
}
