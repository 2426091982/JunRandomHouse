<template>
  <div class="container">
    <!-- 收起图标 -->
    <div class="downIcon">===</div>
    <!-- 标题 -->
    <div class="title">
      <div class="text flexCenter">好书推荐</div>
      <div class="more flexCenter">
        <!-- 更多图标 -->
        <van-icon name="ellipsis" />
      </div>
    </div>
    <!-- 阅读进度列表 -->
    <ul class="ReadSchedule">
      <!-- 每一本书的进度 -->
      <li class="scheduleItem">
        <!-- 图片 -->
        <div class="pic flexCenter">
          <van-image
            class="image"
            width="50"
            height="70"
            fit="fill"
            lazy-load
            src="https://wfqqreader-1252317822.image.myqcloud.com/cover/74/31418074/t6_31418074.jpg"
          />
        </div>
        <!-- 书籍详情 -->
        <div class="bookDetails">
          <h4 class="bookName ellipsis">Mysql从入门到删库跑路</h4>
          <div class="author ellipsis">by zhengjiajun</div>
          <div class="score">
            <!-- 评分星星 -->
            <van-rate
              v-model="scoreValue"
              :size="15"
              color="#ffd21e"
              void-icon="star"
              void-color="#eee"
              readonly
            />
          </div>
        </div>
        <!-- 进度条 -->
        <div class="progress flexCenter" title="好评率">
          <van-circle
            :current-rate="65"
            :stroke-width="60"
            text="65%"
            color="#f88358"
            layer-color="#e3e3e3"
            size="45px"
          />
        </div>
      </li>
      <li class="scheduleItem">
        <!-- 图片 -->
        <div class="pic flexCenter">
          <van-image
            class="image"
            width="50"
            height="70"
            fit="fill"
            lazy-load
            src="https://wfqqreader-1252317822.image.myqcloud.com/cover/74/31418074/t6_31418074.jpg"
          />
        </div>
        <!-- 书籍详情 -->
        <div class="bookDetails">
          <h4 class="bookName ellipsis">Mysql从入门到删库跑路</h4>
          <div class="author ellipsis">by zhengjiajun</div>
          <div class="score">
            <!-- 评分星星 -->
            <van-rate
              v-model="scoreValue"
              :size="15"
              color="#ffd21e"
              void-icon="star"
              void-color="#eee"
              readonly
            />
          </div>
        </div>
        <!-- 进度条 -->
        <div class="progress flexCenter">
          <van-circle
            :current-rate="65"
            :stroke-width="60"
            text="65%"
            color="#f88358"
            layer-color="#e3e3e3"
            size="45px"
          />
        </div>
      </li>
      <li class="scheduleItem">
        <!-- 图片 -->
        <div class="pic flexCenter">
          <van-image
            class="image"
            width="50"
            height="70"
            fit="fill"
            lazy-load
            src="https://wfqqreader-1252317822.image.myqcloud.com/cover/74/31418074/t6_31418074.jpg"
          />
        </div>
        <!-- 书籍详情 -->
        <div class="bookDetails">
          <h4 class="bookName ellipsis">Mysql从入门到删库跑路</h4>
          <div class="author ellipsis">by zhengjiajun</div>
          <div class="score">
            <!-- 评分星星 -->
            <van-rate
              v-model="scoreValue"
              :size="15"
              color="#ffd21e"
              void-icon="star"
              void-color="#eee"
              readonly
            />
          </div>
        </div>
        <!-- 进度条 -->
        <div class="progress flexCenter">
          <van-circle
            :current-rate="65"
            :stroke-width="60"
            text="65%"
            color="#f88358"
            layer-color="#e3e3e3"
            size="45px"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, computed } from "vue";
export default {
  name: "RecentlyRead",
  setup() {
    // 得分值
    const scoreValue = ref(5);

    return { scoreValue };
  },
};
</script>

<style lang="less" scoped>
.container {
 
  background-color: #56b4a6;
  padding: 15px;
  border-radius: 20px;
  color: #fff;

  .downIcon {
    text-align: center;
    color: rgba(255, 255, 255, 0.5);
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .text {
      padding: 15px 10px;
    }

    .more {
      padding: 15px 10px;

      .van-icon {
      }
    }
  }

  ul.ReadSchedule {
    li.scheduleItem {
      border-radius: 20px;
      display: flex;
      background-color: #fff;
      color: #666;
      padding: 10px;
      margin-bottom: 10px;
      .pic {
        .image {
          border-radius: 10px !important ;
          overflow: hidden !important;
        }
      }

      .bookDetails {
        flex: 1;
        padding: 0 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .bookName {
        }

        .author {
          color: #d2d2d2;
        }

        .score {
        }
      }

      .progress {
        width: 55px;
      }
    }
  }
}
</style>
