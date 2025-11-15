import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { FaCalendarAlt, FaClock, FaUser, FaImage, FaTicketAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useInstance } from '../context/InstanceContext';

const StepContainer = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const SchedulingContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
`;

const StepTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
`;

const StepIcon = styled.span`
  margin-right: 0.5rem;
  font-size: 1.2rem;
`;

const DateGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
  min-height: 150px;
  justify-content: center;
  align-items: center;
`;

const DateButton = styled(motion.button)`
  padding: 1rem;
  border: none;
  background-color: ${({ isSelected, theme }) => isSelected ? theme.colors.primary : theme.colors.secondary};
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const TimeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const TimeSlot = styled(motion.button)`
  padding: 0.5rem;
  border: none;
  background-color: ${({ isSelected, theme }) => isSelected ? theme.colors.primary : theme.colors.secondary};
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const NoDatesMessage = styled.p`
  text-align: center;
  width: 100%;
  padding: 1rem;
  font-style: italic;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const ImageUploadContainer = styled.div`
  margin-top: 1rem;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 200px;
  margin-top: 1rem;
`;

const ClientScheduling = () => {
  const { instanceId, availability } = useInstance();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [step, setStep] = useState('date');
  const navigate = useNavigate();

  useEffect(() => {
    if (availability) {
      const dates = Object.keys(availability).filter(date => {
        if (availability[date] && availability[date].availableSlots) {
          const slots = availability[date].availableSlots;
          return Object.values(slots).some(isAvailable => isAvailable);
        }
        return false;
      });
      setAvailableDates(dates);
    }
  }, [availability]);

  useEffect(() => {
    if (selectedDate && availability && availability[selectedDate] && availability[selectedDate].availableSlots) {
      const slots = Object.entries(availability[selectedDate].availableSlots)
        .filter(([_, isAvailable]) => isAvailable)
        .map(([time, _]) => time);
      setAvailableSlots(slots);
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate, availability]);

  const handleDateSelection = (date) => {
    setSelectedDate(date);
    setSelectedTime('');
    setStep('time');
  };

  const handleTimeSelection = (time) => {
    setSelectedTime(time);
    setStep('info');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmAppointment = async () => {
    if (!name || !phone) {
      alert('Please enter your name and phone number');
      return;
    }

    try {
        const response = await fetch(`/api/${instanceId}/appointments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                date: selectedDate,
                time: selectedTime,
                clientName: name,
                phone: phone,
                status: 'scheduled',
                image: image,
                couponCode: couponCode,
            }),
        });

        if (!response.ok) {
            let errorMessage = 'Failed to create appointment. Please try again.';
            try {
                const errorData = await response.json();
                if (errorData && errorData.message) {
                    errorMessage = errorData.message;
                }
            } catch (e) {
                console.error("Could not parse error response as JSON", e);
            }
            console.error('Error creating appointment:', errorMessage);
            alert(`Error: ${errorMessage}`);
            return;
        }

        const newAppointment = await response.json();
        navigate(`/${instanceId}/appointment-confirmation/${newAppointment.id}`);
    } catch (networkError) {
        console.error('Network or other error creating appointment:', networkError);
        alert(`An unexpected error occurred: ${networkError.message}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5 } }
  };

  return (
    <SchedulingContainer>
      <Title>Schedule Your Nail Appointment</Title>
      <LayoutGroup>
        <AnimatePresence mode="wait">
          {step === 'date' && (
            <StepContainer
              key="date-selection"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
            >
              <StepTitle>
                <StepIcon><FaCalendarAlt /></StepIcon>
                Select a Date
              </StepTitle>
              <DateGrid>
                {availableDates.length > 0 ? (
                  availableDates.map((date) => (
                    <DateButton
                      key={date}
                      isSelected={date === selectedDate}
                      onClick={() => handleDateSelection(date)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      layout
                    >
                      {format(parseISO(date), 'MMM d')}
                    </DateButton>
                  ))
                ) : (
                  <NoDatesMessage>No available dates. Please check back later.</NoDatesMessage>
                )}
              </DateGrid>
            </StepContainer>
          )}

          {step === 'time' && (
            <StepContainer
              key="time-selection"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
            >
              <StepTitle>
                <StepIcon><FaClock /></StepIcon>
                Select a Time for {format(parseISO(selectedDate), 'MMM d')}
              </StepTitle>
              <TimeGrid>
                {availableSlots.map((slot, index) => (
                  <TimeSlot
                    key={index}
                    isSelected={selectedTime === slot}
                    onClick={() => handleTimeSelection(slot)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    layout
                  >
                    {slot}
                  </TimeSlot>
                ))}
              </TimeGrid>
            </StepContainer>
          )}

          {step === 'info' && (
            <StepContainer
              key="info-collection"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
            >
              <StepTitle>
                <StepIcon><FaUser /></StepIcon>
                Your Information
              </StepTitle>
              <Input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type="tel"
                placeholder="Your Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <ImageUploadContainer>
                <StepTitle>
                  <StepIcon><FaImage /></StepIcon>
                  Upload Design Inspiration (Optional)
                </StepTitle>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {image && <ImagePreview src={image} alt="Design Inspiration" />}
              </ImageUploadContainer>
              <StepTitle>
                <StepIcon><FaTicketAlt /></StepIcon>
                Have a Coupon?
              </StepTitle>

              <Input
                type="text"
                placeholder="Enter Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                style={{ marginTop: '1rem' }}
              />
              <Button onClick={handleConfirmAppointment}>Confirm Appointment</Button>
            </StepContainer>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </SchedulingContainer>
  );
};

export default ClientScheduling;