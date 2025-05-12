/**
 *
 * Homepage
 *
 */

import React from 'react'
import axios from 'axios'
import { Row, Col } from 'reactstrap'

import banners from './banners.json'
import CarouselSlider from '../../components/Common/CarouselSlider'
import { responsiveOneItemCarousel } from '../../components/Common/CarouselSlider/utils'
import ProductList from '../../components/Store/ProductList'
import { API_URL } from '../../constants'

// fetch product by slug
const fetchProductBySlug = async slug => {
  try {
    const response = await axios.get(`${API_URL}/product/item/${slug}`)
    return response.data.product
  } catch (error) {
    console.error(`Product not found for slug: ${slug}`)
    return null
  }
}

class Homepage extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      categoriesWithProducts: []
    }
  }

  async componentDidMount() {
    try {
      // ✅ Get all categories
      const response = await axios.get(`${API_URL}/category`)
      const categories = response.data.categories

      // ✅ For each category, fetch max 4 products by slug
      const categoriesWithProducts = await Promise.all(
        categories.map(async category => {
          const products = await Promise.all(
            (category.products || [])
              .slice(0, 4)
              .map(async product => await fetchProductBySlug(product.slug))
          )
          return {
            ...category,
            products: products.filter(Boolean) // remove nulls
          }
        })
      )

      this.setState({ categoriesWithProducts })
    } catch (err) {
      console.error('Homepage load failed:', err)
    }
  }

  render() {
    const { categoriesWithProducts } = this.state

    return (
      <div className='homepage'>
        {/* ---------------- BANNER SECTION ---------------- */}
        <Row className='flex-row'>
          <Col xs='12' lg='6' className='order-lg-2 mb-3 px-3 px-md-2'>
            <div className='home-carousel'>
              <CarouselSlider
                swipeable
                showDots
                infinite
                autoPlay={false}
                slides={banners}
                responsive={responsiveOneItemCarousel}
              >
                {banners.map((item, index) => (
                  <img
                    key={index}
                    src={item.imageUrl}
                    alt={`Banner ${index}`}
                    loading='lazy'
                  />
                ))}
              </CarouselSlider>
            </div>
          </Col>

          <Col xs='12' lg='3' className='order-lg-1 mb-3 px-3 px-md-2'>
            <div className='d-flex flex-column h-100 justify-content-between'>
              <img
                src='/images/banners/banner-2.jpg'
                className='mb-3'
                alt='Banner 2'
                loading='lazy'
              />
              <img
                src='/images/banners/banner-5.jpg'
                alt='Banner 5'
                loading='lazy'
              />
            </div>
          </Col>

          <Col xs='12' lg='3' className='order-lg-3 mb-3 px-3 px-md-2'>
            <div className='d-flex flex-column h-100 justify-content-between'>
              <img
                src='/images/banners/banner-2.jpg'
                className='mb-3'
                alt='Banner 2'
                loading='lazy'
              />
              <img
                src='/images/banners/banner-6.jpg'
                alt='Banner 6'
                loading='lazy'
              />
            </div>
          </Col>
        </Row>

        {/* ---------------- PRODUCTS BY CATEGORY ---------------- */}
        <div className='mt-5 px-3'>
          {categoriesWithProducts.map(category => (
            <div key={category._id} className='mb-5'>
              <h2 className='mb-4'>{category.name}</h2>
              {category.products.length > 0 ? (
                <ProductList products={category.products} />
              ) : (
                <p>No products found in {category.name}.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default Homepage
