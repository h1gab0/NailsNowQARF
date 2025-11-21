import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useInstance } from '../context/InstanceContext';
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaCheck,
  FaHandSparkles,
  FaSpa,
  FaPaintBrush,
  FaCut,
  FaHeart,
  FaStar,
  FaGem
} from 'react-icons/fa';

const Container = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.button`
  background-color: ${({ theme, variant }) =>
    variant === 'danger' ? theme.colors.error :
    variant === 'secondary' ? theme.colors.secondary :
    theme.colors.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 1rem;
  position: relative;
  background-color: ${({ theme }) => theme.colors.background};
`;

const CardActions = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme, variant }) => variant === 'danger' ? theme.colors.error : theme.colors.text};
  cursor: pointer;
  padding: 4px;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Form = styled.form`
  display: grid;
  gap: 1rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  min-height: 80px;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FeatureItem = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const IconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0.5rem;
  border-radius: 4px;
  max-height: 150px;
  overflow-y: auto;
`;

const IconOption = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 4px;
  background-color: ${({ selected, theme }) => selected ? theme.colors.primaryLight : 'transparent'};
  color: ${({ selected, theme }) => selected ? theme.colors.primary : theme.colors.text};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryLight};
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 0.5rem;
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: bold;
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.textLight};
  border-bottom: 2px solid ${({ active, theme }) => active ? theme.colors.primary : 'transparent'};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const AVAILABLE_ICONS = [
  { id: 'FaHandSparkles', icon: FaHandSparkles },
  { id: 'FaSpa', icon: FaSpa },
  { id: 'FaPaintBrush', icon: FaPaintBrush },
  { id: 'FaCut', icon: FaCut },
  { id: 'FaHeart', icon: FaHeart },
  { id: 'FaStar', icon: FaStar },
  { id: 'FaGem', icon: FaGem },
];

const ServiceForm = ({ service, categories, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(service || {
    name: '',
    description: '',
    price: '',
    duration: '',
    category: categories[0]?.id || '',
    features: [''],
    icon: 'FaHandSparkles',
    isPopular: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Filter out empty features
    const cleanedData = {
      ...formData,
      features: formData.features.filter(f => f.trim() !== '')
    };
    onSubmit(cleanedData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <Label>Service Name</Label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </InputGroup>

      <InputGroup>
        <Label>Description</Label>
        <TextArea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </InputGroup>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <InputGroup>
          <Label>Price</Label>
          <Input
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="$30"
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>Duration</Label>
          <Input
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="45 min"
            required
          />
        </InputGroup>
      </div>

      <InputGroup>
        <Label>Category</Label>
        <Select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </Select>
      </InputGroup>

      <InputGroup>
        <Label>Icon</Label>
        <IconGrid>
          {AVAILABLE_ICONS.map(({ id, icon: Icon }) => (
            <IconOption
              key={id}
              selected={formData.icon === id}
              onClick={() => setFormData(prev => ({ ...prev, icon: id }))}
            >
              <Icon />
            </IconOption>
          ))}
        </IconGrid>
      </InputGroup>

      <InputGroup>
        <Label>Features</Label>
        <FeatureList>
          {formData.features.map((feature, index) => (
            <FeatureItem key={index}>
              <Input
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                placeholder="Feature description"
              />
              <ActionButton type="button" variant="danger" onClick={() => removeFeature(index)}>
                <FaTimes />
              </ActionButton>
            </FeatureItem>
          ))}
          <Button type="button" variant="secondary" onClick={addFeature} style={{ width: 'fit-content' }}>
            <FaPlus /> Add Feature
          </Button>
        </FeatureList>
      </InputGroup>

      <InputGroup>
        <Label>
          <Input
            type="checkbox"
            name="isPopular"
            checked={formData.isPopular}
            onChange={handleChange}
            style={{ width: 'auto', marginRight: '0.5rem' }}
          />
          Mark as Popular
        </Label>
      </InputGroup>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit"><FaCheck /> Save Service</Button>
      </div>
    </Form>
  );
};

const CategoryForm = ({ category, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(category || { id: '', name: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
      <InputGroup>
        <Label>Category ID (unique, lowercase, no spaces)</Label>
        <Input
          name="id"
          value={formData.id}
          onChange={handleChange}
          required
          pattern="[a-z0-9-]+"
          disabled={!!category} // ID cannot be changed easily
        />
      </InputGroup>
      <InputGroup>
        <Label>Category Name</Label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </InputGroup>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit"><FaCheck /> Save Category</Button>
      </div>
    </Form>
  );
};

const ServiceManagement = () => {
  const { instanceId } = useInstance();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('services');
  const [editingItem, setEditingItem] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/${instanceId}/services`);
      const data = await res.json();
      setServices(data.services || []);
      setCategories(data.categories || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch services', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (instanceId) {
      fetchData();
    }
  }, [instanceId]);

  const handleCreateService = async (serviceData) => {
    try {
      const res = await fetch(`/api/${instanceId}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData),
        credentials: 'include'
      });
      if (res.ok) {
        fetchData();
        setIsCreating(false);
      }
    } catch (error) {
      console.error('Error creating service', error);
    }
  };

  const handleUpdateService = async (serviceData) => {
    try {
      const res = await fetch(`/api/${instanceId}/services/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData),
        credentials: 'include'
      });
      if (res.ok) {
        fetchData();
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Error updating service', error);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await fetch(`/api/${instanceId}/services/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting service', error);
    }
  };

  const handleCreateCategory = async (categoryData) => {
    try {
      const res = await fetch(`/api/${instanceId}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
        credentials: 'include'
      });
      if (res.ok) {
        fetchData();
        setIsCreating(false);
      } else {
          const error = await res.json();
          alert(error.message);
      }
    } catch (error) {
      console.error('Error creating category', error);
    }
  };

  const handleUpdateCategory = async (categoryData) => {
    try {
      const res = await fetch(`/api/${instanceId}/categories/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
        credentials: 'include'
      });
      if (res.ok) {
        fetchData();
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Error updating category', error);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`/api/${instanceId}/categories/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting category', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container>
      <Title>Service Management</Title>

      <Tabs>
        <Tab active={activeTab === 'services'} onClick={() => { setActiveTab('services'); setIsCreating(false); setEditingItem(null); }}>Services</Tab>
        <Tab active={activeTab === 'categories'} onClick={() => { setActiveTab('categories'); setIsCreating(false); setEditingItem(null); }}>Categories</Tab>
      </Tabs>

      {/* Services View */}
      {activeTab === 'services' && (
        <>
          {!isCreating && !editingItem && (
            <Button onClick={() => setIsCreating(true)}><FaPlus /> Add New Service</Button>
          )}

          {isCreating && (
            <ServiceForm
              categories={categories}
              onSubmit={handleCreateService}
              onCancel={() => setIsCreating(false)}
            />
          )}

          {editingItem && (
            <ServiceForm
              service={editingItem}
              categories={categories}
              onSubmit={handleUpdateService}
              onCancel={() => setEditingItem(null)}
            />
          )}

          {!isCreating && !editingItem && (
            <Grid>
              {services.map(service => (
                <Card key={service.id}>
                  <CardActions>
                    <ActionButton onClick={() => setEditingItem(service)}>
                      <FaEdit />
                    </ActionButton>
                    <ActionButton variant="danger" onClick={() => handleDeleteService(service.id)}>
                      <FaTrash />
                    </ActionButton>
                  </CardActions>
                  <h3>{service.name}</h3>
                  <p style={{ color: '#888', fontSize: '0.9rem' }}>{service.price} • {service.duration}</p>
                  <p>{service.description}</p>
                  <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    Category: {categories.find(c => c.id === service.category)?.name || service.category}
                  </p>
                </Card>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Categories View */}
      {activeTab === 'categories' && (
        <>
          {!isCreating && !editingItem && (
            <Button onClick={() => setIsCreating(true)}><FaPlus /> Add New Category</Button>
          )}

          {isCreating && (
            <CategoryForm
              onSubmit={handleCreateCategory}
              onCancel={() => setIsCreating(false)}
            />
          )}

          {editingItem && (
            <CategoryForm
              category={editingItem}
              onSubmit={handleUpdateCategory}
              onCancel={() => setEditingItem(null)}
            />
          )}

          {!isCreating && !editingItem && (
            <Grid>
              {categories.map(category => (
                <Card key={category.id}>
                  <CardActions>
                    <ActionButton onClick={() => setEditingItem(category)}>
                      <FaEdit />
                    </ActionButton>
                    <ActionButton variant="danger" onClick={() => handleDeleteCategory(category.id)}>
                      <FaTrash />
                    </ActionButton>
                  </CardActions>
                  <h3>{category.name}</h3>
                  <p style={{ color: '#888' }}>ID: {category.id}</p>
                </Card>
              ))}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
};

export default ServiceManagement;
