import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useInstance } from '../context/InstanceContext';
import { 
  FaClock, 
  FaDollarSign, 
  FaStar, 
  FaHandSparkles, 
  FaSpa, 
  FaPaintBrush,
  FaInfoCircle,
  FaCheck,
  FaArrowRight,
  FaCut,
  FaHeart,
  FaGem
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ServicesContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const HeroSection = styled.div`
  position: relative;
  height: 40vh;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary}20,
    ${({ theme }) => theme.colors.secondary}30
  );
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const HeroContent = styled(motion.div)`
  text-align: center;
  z-index: 2;
`;

const ServiceTitle = styled(motion.h1)`
  font-size: 3.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2.5rem;
  }
`;

const ServiceSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.2rem;
  margin-top: 1rem;
  opacity: 0.8;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1rem;
    padding: 0 1rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: -60px auto 2rem;
  padding: 1rem;
  position: relative;
  z-index: 3;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: -40px;
    padding: 0.5rem;
  }
`;

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ServiceCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.radii.large};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  padding: 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 1.5rem;
  }
`;

const PopularBadge = styled(motion.div)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.radii.small};
  font-size: 0.8rem;
  font-weight: bold;
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 1rem;
  padding-top: 80px;
  overflow-y: auto;
`;

const ModalContent = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: 2rem;
  border-radius: ${({ theme }) => theme.radii.large};
  max-width: 500px;
  width: 90%;
  position: relative;
  max-height: calc(90vh - 80px);
  overflow-y: auto;
  margin: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 1.5rem;
    width: 95%;
    margin: 0.5rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  z-index: 1101;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const BookButton = styled(motion.button)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: ${({ theme }) => theme.radii.medium};
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0 2rem;
  flex-wrap: wrap;
  padding: 0.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: 0.5rem;
    margin: 0.5rem 0 1rem;
  }
`;

const CategoryTab = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: ${({ theme }) => theme.radii.medium};
  background-color: ${({ active, theme }) => 
    active ? theme.colors.primary : theme.colors.cardBackground};
  color: ${({ active, theme }) => 
    active ? 'white' : theme.colors.text};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${({ theme }) => theme.shadows.small};
  font-size: 1rem;

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    flex: 1;
    min-width: calc(50% - 0.5rem);
    text-align: center;
  }
`;

const ServiceIcon = styled.div`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
`;

const ServiceName = styled.h2`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.text};
  margin: 1rem 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.5rem;
    margin: 0.5rem 0;
  }
`;

const ServiceDescription = styled.p`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1.5rem;
  line-height: 1.6;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
`;

const ServiceFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
  display: grid;
  gap: 0.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin: 1rem 0;
    gap: 0.3rem;
  }
`;

const ServiceFeature = styled.li`
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.85rem;
  }
`;

const PriceTag = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-top: 1rem;
`;

const PriceAndDuration = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 1rem 0;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text};

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1rem;
  }
`;

// Icon mapping
const iconMap = {
  'FaHandSparkles': FaHandSparkles,
  'FaSpa': FaSpa,
  'FaPaintBrush': FaPaintBrush,
  'FaCut': FaCut,
  'FaHeart': FaHeart,
  'FaStar': FaStar,
  'FaGem': FaGem,
};

function Services() {
  const [selectedService, setSelectedService] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([{ id: 'all', name: 'All Services' }]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { instanceId } = useInstance();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/${instanceId}/services`);
        const data = await res.json();

        setServices(data.services || []);

        // Ensure 'All Services' is first and merged with backend categories
        const backendCategories = data.categories || [];
        setCategories([
          { id: 'all', name: 'All Services' },
          ...backendCategories
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch services', error);
        setLoading(false);
      }
    };

    if (instanceId) {
      fetchData();
    }
  }, [instanceId]);

  const handleBooking = () => {
    navigate('/schedule', { state: { selectedService } });
  };

  const filteredServices = activeCategory === 'all' 
    ? services 
    : services.filter(service => service.category === activeCategory);

  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedService]);

  // Helper to render icon safely
  const renderIcon = (iconName) => {
    const IconComponent = iconMap[iconName] || FaHandSparkles;
    return <IconComponent />;
  };

  const renderIconLarge = (iconName) => {
    const IconComponent = iconMap[iconName] || FaHandSparkles;
    return <IconComponent size={40} />;
  };

  if (loading) {
    return <ServicesContainer style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</ServicesContainer>;
  }

  return (
    <ServicesContainer>
      <HeroSection>
        <HeroContent
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ServiceTitle>Our Services</ServiceTitle>
          <ServiceSubtitle>Choose from our range of professional nail care services</ServiceSubtitle>
        </HeroContent>
      </HeroSection>

      <ContentWrapper>
        <CategoryTabs>
          {categories.map(category => (
            <CategoryTab
              key={category.id}
              active={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </CategoryTab>
          ))}
        </CategoryTabs>

        <ServiceGrid>
          <AnimatePresence>
            {filteredServices.map((service, index) => (
              <ServiceCard
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedService(service)}
              >
                {service.isPopular && <PopularBadge>Popular</PopularBadge>}
                <div>
                  <ServiceIcon>
                    {renderIcon(service.icon)}
                  </ServiceIcon>
                  <ServiceName>{service.name}</ServiceName>
                  <ServiceDescription>{service.description}</ServiceDescription>
                </div>
                <div>
                  <ServiceFeatures>
                    {service.features.slice(0, 3).map((feature, i) => (
                      <ServiceFeature key={i}>
                        <FaCheck size={12} color="green" />
                        {feature}
                      </ServiceFeature>
                    ))}
                  </ServiceFeatures>
                  <PriceAndDuration>
                    <InfoItem>
                      <FaClock /> {service.duration}
                    </InfoItem>
                    <InfoItem>
                      <FaDollarSign />{service.price}
                    </InfoItem>
                  </PriceAndDuration>
                </div>
              </ServiceCard>
            ))}
          </AnimatePresence>
        </ServiceGrid>

        <AnimatePresence>
          {selectedService && (
            <Modal
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
            >
              <ModalContent
                onClick={e => e.stopPropagation()}
                initial={{ scale: 0.5, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.5, opacity: 0, y: 50 }}
                transition={{ type: "spring", damping: 25 }}
              >
                <CloseButton 
                  onClick={() => setSelectedService(null)}
                  aria-label="Close modal"
                >
                  ×
                </CloseButton>
                <ServiceIcon>
                  {renderIconLarge(selectedService.icon)}
                </ServiceIcon>
                <ServiceName>{selectedService.name}</ServiceName>
                <ServiceDescription>{selectedService.description}</ServiceDescription>
                <ServiceFeatures>
                  {selectedService.features.map((feature, i) => (
                    <ServiceFeature key={i}>
                      <FaCheck size={12} color="green" />
                      {feature}
                    </ServiceFeature>
                  ))}
                </ServiceFeatures>
                <div>
                  <FaClock /> {selectedService.duration}
                </div>
                <PriceTag>
                  <FaDollarSign />{selectedService.price}
                </PriceTag>
                <BookButton
                  onClick={handleBooking}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Book Now <FaArrowRight />
                </BookButton>
              </ModalContent>
            </Modal>
          )}
        </AnimatePresence>
      </ContentWrapper>
    </ServicesContainer>
  );
}

export default Services;
