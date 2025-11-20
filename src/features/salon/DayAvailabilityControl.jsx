// src/components/DayAvailabilityControl.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';

const ControlContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 4px;
`;

const ToggleButton = styled.button`
  background-color: ${({ isAvailable, theme }) => isAvailable ? theme.colors.primary : theme.colors.secondary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
`;

const TimeSlotContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

const TimeSlotToggle = styled.button`
  background-color: ${({ isAvailable, theme }) => isAvailable ? theme.colors.primary : theme.colors.secondary};
  color: white;
  border: none;
  padding: 0.5rem;
  margin: 0.25rem;
  border-radius: 4px;
  cursor: pointer;
`;

const AddSlotButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
`;

const DayAvailabilityControl = ({ selectedDate, availability, onAvailabilityChange }) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [availableSlots, setAvailableSlots] = useState({});

  useEffect(() => {
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const dayAvailability = availability[dateString] || { isAvailable: false, availableSlots: {} };
    setIsAvailable(dayAvailability.isAvailable);
    setAvailableSlots(dayAvailability.availableSlots);
  }, [selectedDate, availability]);

  const toggleAvailability = () => {
    const newIsAvailable = !isAvailable;
    setIsAvailable(newIsAvailable);
    onAvailabilityChange(selectedDate, newIsAvailable, availableSlots);
  };

  const toggleTimeSlot = (time) => {
    const updatedSlots = { ...availableSlots, [time]: !availableSlots[time] };
    setAvailableSlots(updatedSlots);
    onAvailabilityChange(selectedDate, isAvailable, updatedSlots);
  };

  const addTimeSlot = () => {
    const newTime = prompt('Enter new time slot (e.g., 2:00 PM):');
    if (newTime) {
      const updatedSlots = { ...availableSlots, [newTime]: true };
      setAvailableSlots(updatedSlots);
      onAvailabilityChange(selectedDate, isAvailable, updatedSlots);
    }
  };

  const timeSlots = Object.keys(availableSlots).sort();

  return (
    <ControlContainer>
      <h3>Availability for {format(selectedDate, 'MMMM d, yyyy')}</h3>
      <ToggleButton isAvailable={isAvailable} onClick={toggleAvailability}>
        {isAvailable ? 'Set as Unavailable' : 'Set as Available'}
      </ToggleButton>
      {isAvailable && (
        <>
          <TimeSlotContainer>
            {timeSlots.map((time) => (
              <TimeSlotToggle
                key={time}
                isAvailable={availableSlots[time]}
                onClick={() => toggleTimeSlot(time)}
              >
                {time}
              </TimeSlotToggle>
            ))}
          </TimeSlotContainer>
          <AddSlotButton onClick={addTimeSlot}>Add Time Slot</AddSlotButton>
        </>
      )}
    </ControlContainer>
  );
};

export default DayAvailabilityControl;