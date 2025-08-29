if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/aminigbo/.gradle/caches/8.10.2/transforms/b01be3be4172a5e0253711b79a26ed2c/transformed/jetified-hermes-android-0.76.1-debug/prefab/modules/libhermes/libs/android.arm64-v8a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/aminigbo/.gradle/caches/8.10.2/transforms/b01be3be4172a5e0253711b79a26ed2c/transformed/jetified-hermes-android-0.76.1-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

