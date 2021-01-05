Feature: Display select-a-resource screen when user clicks Start your booking
    Screen should be displayed listing all the items that can be booked

    Scenario: User has main web page open
        Given user is on front screen
        When the customer clicks Start your booking
        Then the select-a-resource screen should be displayed
