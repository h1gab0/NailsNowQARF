import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 2rem;
  text-align: center;
`;

const Section = styled.section`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: 0;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 0.5rem;
`;

const InstanceList = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const InstanceItem = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    padding: 1rem;
    margin-bottom: 1rem;
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: 4px;
    transition: box-shadow 0.3s ease;
    &:hover {
        box-shadow: ${({ theme }) => theme.shadows.small};
    }
`;

const InstanceInfo = styled.div`
    flex-grow: 1;
`;

const InstanceLinks = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
`;

const InstanceLink = styled(Link)`
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    font-weight: bold;
    &:hover {
        text-decoration: underline;
    }
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const SuperAdminDashboard = () => {
    const [instances, setInstances] = useState([]);
    const [newInstance, setNewInstance] = useState({ id: '', name: '', phoneNumber: '' });

    useEffect(() => {
        const fetchInstances = async () => {
            try {
                const response = await fetch('/api/instances', { credentials: 'include' });
                if (response.ok) {
                    const data = await response.json();
                    setInstances(data);
                }
            } catch (error) {
                console.error("Failed to fetch instances", error);
            }
        };
        fetchInstances();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // For ID, allow only lowercase letters, numbers, and dashes
        if (name === 'id') {
            setNewInstance(prev => ({ ...prev, [name]: value.toLowerCase().replace(/[^a-z0-9-]/g, '') }));
        } else {
            setNewInstance(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCreateInstance = async (e) => {
        e.preventDefault();
        if (!newInstance.id || !newInstance.name || !newInstance.phoneNumber) {
            alert('Please provide an ID, a name, and a phone number for the new instance.');
            return;
        }
        try {
            const response = await fetch('/api/instances', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newInstance),
                credentials: 'include'
            });
            if (response.ok) {
                const createdInstance = await response.json();
                setInstances(prev => [...prev, createdInstance]);
                alert(`Instance "${createdInstance.name}" created successfully!\nDefault admin credentials will be sent to the provided phone number.`);
                setNewInstance({ id: '', name: '', phoneNumber: '' });
            } else {
                const errorData = await response.json();
                alert(`Failed to create instance: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Failed to create instance", error);
            alert('An error occurred while creating the instance.');
        }
    };

    return (
        <DashboardContainer>
            <Title>Super Admin Dashboard</Title>

            <Section>
                <SectionTitle>Manage Instances</SectionTitle>
                <InstanceList>
                    {instances.map(instance => (
                        <InstanceItem key={instance.id}>
                            <InstanceInfo>
                                <strong>{instance.name}</strong>
                                <br />
                                <small>URL Path: /{instance.id}</small>
                            </InstanceInfo>
                            <InstanceLinks>
                                <InstanceLink to={`/${instance.id}/admin`}>Admin View</InstanceLink>
                                {' | '}
                                <InstanceLink to={`/${instance.id}`}>Public View</InstanceLink>
                            </InstanceLinks>
                        </InstanceItem>
                    ))}
                </InstanceList>
            </Section>

            <Section>
                <SectionTitle>Create New Instance</SectionTitle>
                <Form onSubmit={handleCreateInstance}>
                    <Input
                        type="text"
                        name="name"
                        placeholder="Instance Name (e.g., Jane's Nail Salon)"
                        value={newInstance.name}
                        onChange={handleInputChange}
                    />
                    <Input
                        type="text"
                        name="id"
                        placeholder="Instance URL ID (e.g., janes-nails)"
                        value={newInstance.id}
                        onChange={handleInputChange}
                    />
                    <Input
                        type="tel"
                        name="phoneNumber"
                        placeholder="Instance Admin Phone Number (e.g., +1234567890)"
                        value={newInstance.phoneNumber}
                        onChange={handleInputChange}
                    />
                    <Button type="submit">Create Instance</Button>
                </Form>
            </Section>
        </DashboardContainer>
    );
};

export default SuperAdminDashboard;
