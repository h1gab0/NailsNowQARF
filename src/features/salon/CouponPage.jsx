import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 2rem;
`;

const CouponsGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
`;

const CouponCard = styled(motion.div)`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  border-radius: 12px;
  padding: 2rem;
  color: white;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    background: ${({ theme }) => theme.colors.background};
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    background: ${({ theme }) => theme.colors.background};
    border-radius: 50%;
  }
`;

const OfferText = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const Validity = styled.span`
  font-size: 0.9rem;
  opacity: 0.8;
  display: block;
  text-align: center;
`;

const CouponPage = () => {
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const navigate = useNavigate();

  const coupons = [
    {
      id: 1,
      discount: "30% OFF",
      description: "First-Time Client Special",
      validity: "Valid for 30 days"
    },
    {
      id: 2,
      discount: "20% OFF",
      description: "Returning Client Appreciation",
      validity: "Valid for 14 days"
    }
  ];

  const handleSelect = (couponId) => {
    setSelectedCoupon(couponId);
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  return (
    <PageContainer>
      <AnimatePresence>
        <CouponsGrid>
          {coupons.map((coupon) => (
            <CouponCard
              key={coupon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: selectedCoupon === null || selectedCoupon === coupon.id ? 1 : 0,
                y: 0,
                scale: selectedCoupon === coupon.id ? 1.05 : 1
              }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => handleSelect(coupon.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <OfferText>{coupon.discount}</OfferText>
              <Description>{coupon.description}</Description>
              <Validity>{coupon.validity}</Validity>
            </CouponCard>
          ))}
        </CouponsGrid>
      </AnimatePresence>
    </PageContainer>
  );
};

export default CouponPage; 