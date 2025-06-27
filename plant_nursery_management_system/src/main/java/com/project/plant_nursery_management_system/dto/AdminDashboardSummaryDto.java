package com.project.plant_nursery_management_system.dto;

public class AdminDashboardSummaryDto {

    private long totalUsers;
    private long totalOrders;
    private long totalPayments;
    private long totalPlants;
    private long totalCategories;
    private long totalFeedBacks;
    private long totalReview;
    private long totalKyc;

    public long getTotalFeedBacks() {
        return totalFeedBacks;
    }

    public void setTotalFeedBacks(long totalFeedBacks) {
        this.totalFeedBacks = totalFeedBacks;
    }

    public long getTotalCategories() {
        return totalCategories;
    }

    public void setTotalCategories(long totalCategories) {
        this.totalCategories = totalCategories;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public long getTotalPayments() {
        return totalPayments;
    }

    public void setTotalPayments(long totalPayments) {
        this.totalPayments = totalPayments;
    }

    public long getTotalPlants() {
        return totalPlants;
    }

    public void setTotalPlants(long totalPlants) {
        this.totalPlants = totalPlants;
    }

    public long getTotalReview() {
        return totalReview;
    }

    public void setTotalReview(long totalReview) {
        this.totalReview = totalReview;
    }

    public long getTotalKyc() {
        return totalKyc;
    }

    public void setTotalKyc(long totalKyc) {
        this.totalKyc = totalKyc;
    }
}
